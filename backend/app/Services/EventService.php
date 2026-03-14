<?php

namespace App\Services;

use App\Models\Address;
use App\Models\Event;
use App\Models\Invitation;
use App\Models\Order;
use Illuminate\Http\UploadedFile;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\URL;

class EventService
{
    protected ImageService $imageService;

    public function __construct(ImageService $imageService)
    {
        $this->imageService = $imageService;
    }

    /**
     * Create a new event with related models.
     *
     * Invitation data is validated by EventRequest before reaching this method.
     * The order of creation: Event → Order → Address → Invitation → Gallery
     * (Invitation, Address, Order, Gallery all require event_id)
     *
     * @param array $data Validated data from EventRequest
     * @return Event
     * @throws \Exception
     */
    public function createEvent(array $data): Event
    {
        $savedFiles = [];

        try {
            DB::beginTransaction();

            $invitationData = $data['invitation'];

            // Process invitation image (base64 → file)
            if (preg_match('/^data:image\/(\w+);base64,/', $invitationData['invitation_img'])) {
                $relativePath = $this->imageService->saveImage(
                    $invitationData['invitation_img'],
                    $invitationData['envelope_img']
                );
                $invitationData['invitation_img'] = $relativePath;
                $savedFiles[] = $relativePath;
            }

            // Process audio
            $audio = $this->processAudio($data, $savedFiles);

            // Create event with explicit fields
            $event = Event::create([
                'title' => $data['title'],
                'type' => $data['type'],
                'description' => $data['description'] ?? null,
                'place' => $data['place'],
                'date' => $data['date'],
                'video_link' => $data['video_link'] ?? null,
                'photos_link' => $data['photos_link'] ?? null,
                'audio' => $audio,
                'status' => $data['status'] ?? 0,
                'created_by' => $data['created_by'],
            ]);

            // Create order
            Order::create([
                'event_id' => $event->id,
                'status' => Order::STATUS_NOT_PAID,
                'price' => $invitationData['price'],
            ]);

            // Create address
            $this->createAddress($data['address'], $event->id);

            // Create invitation
            Invitation::create([
                'invitation_img' => $invitationData['invitation_img'],
                'event_id' => $event->id,
                'content' => is_string($invitationData['content'])
                    ? json_decode($invitationData['content'])
                    : $invitationData['content'],
                'template_id' => $invitationData['template_id'],
                'bg_img' => $invitationData['bg_img'] ?? null,
            ]);

            // Process gallery
            $this->processGallery($data, $event, $savedFiles);

            DB::commit();

            return $event;
        } catch (\Exception $e) {
            DB::rollBack();
            $this->cleanupFiles($savedFiles);
            Log::error('Event creation failed: ' . $e->getMessage(), [
                'line' => $e->getLine(),
                'file' => $e->getFile(),
            ]);
            throw $e;
        }
    }

    /**
     * Update an existing event.
     *
     * @param Event $event
     * @param array $data Validated data from EventRequest
     * @return Event
     */
    public function updateEvent(Event $event, array $data): Event
    {
        $savedFiles = [];

        try {
            DB::beginTransaction();

            // Process audio
            $audio = $this->processAudio($data, $savedFiles);

            // Update event with explicit fields
            $event->update([
                'title' => $data['title'],
                'type' => $data['type'],
                'description' => $data['description'] ?? null,
                'place' => $data['place'],
                'date' => $data['date'],
                'video_link' => $data['video_link'] ?? null,
                'photos_link' => $data['photos_link'] ?? null,
                'audio' => $audio ?? $event->audio,
                'status' => $data['status'] ?? $event->status,
            ]);

            // Update address
            if (isset($data['address'])) {
                $addressData = $data['address'];

                if (isset($addressData['address'])) {
                    $addressData['address'] = $this->extractUrl($addressData['address']);
                }

                $event->address()->update([
                    'address' => $addressData['address'],
                    'lat' => $addressData['lat'],
                    'long' => $addressData['long'],
                ]);
            }

            // Process gallery
            $this->processGallery($data, $event, $savedFiles);

            DB::commit();

            return $event;
        } catch (\Exception $e) {
            DB::rollBack();
            $this->cleanupFiles($savedFiles);
            Log::error('Event update failed: ' . $e->getMessage(), [
                'event_id' => $event->id,
                'line' => $e->getLine(),
                'file' => $e->getFile(),
            ]);
            throw $e;
        }
    }

    /**
     * Delete an event and all associated files.
     *
     * @param Event $event
     * @return void
     */
    public function deleteEvent(Event $event): void
    {
        // Clean up invitation images
        if ($event->invitation?->invitation_img) {
            $originalPath = $event->invitation->invitation_img;
            $miniPath = 'images/invitations/620x640/' . basename($originalPath);

            Storage::disk('public')->delete($originalPath);
            Storage::disk('public')->delete($miniPath);
        }

        // Clean up gallery images
        foreach ($event->images as $image) {
            if (Storage::disk('public')->exists($image->path)) {
                Storage::disk('public')->delete($image->path);
            }
        }

        // Clean up audio file
        if ($event->audio && !filter_var($event->audio, FILTER_VALIDATE_URL)) {
            Storage::disk('public')->delete($event->audio);
        }

        $event->delete();
    }

    /**
     * Process audio data: handle uploaded file or normalize existing path.
     *
     * @param array $data
     * @param array &$savedFiles Tracks saved files for cleanup on rollback
     * @return string|null
     */
    private function processAudio(array $data, array &$savedFiles): ?string
    {
        if (isset($data['audioFile']) && $data['audioFile'] instanceof UploadedFile) {
            $path = $data['audioFile']->store('audio', 'public');
            $savedFiles[] = $path;
            return $path;
        }

        if (isset($data['audio'])) {
            return $this->normalizeAudioPath($data['audio']);
        }

        return null;
    }

    /**
     * Create address record for an event.
     *
     * @param array $addressData
     * @param int $eventId
     * @return void
     */
    private function createAddress(array $addressData, int $eventId): void
    {
        if (isset($addressData['address'])) {
            $addressData['address'] = $this->extractUrl($addressData['address']);
        }

        Address::create([
            'address' => $addressData['address'],
            'lat' => $addressData['lat'],
            'long' => $addressData['long'],
            'event_id' => $eventId,
        ]);
    }

    /**
     * Process gallery images: save files and create EventImage records.
     *
     * @param array $data
     * @param Event $event
     * @param array &$savedFiles Tracks saved files for cleanup on rollback
     * @return void
     */
    private function processGallery(array $data, Event $event, array &$savedFiles): void
    {
        if (!isset($data['gallery']) || !is_array($data['gallery'])) {
            return;
        }

        $currentCount = $event->images()->count();

        foreach ($data['gallery'] as $image) {
            if ($currentCount >= 5) {
                break;
            }

            if ($image instanceof UploadedFile) {
                $path = $image->store('event_images', 'public');
                $savedFiles[] = $path;
                $event->images()->create(['path' => $path]);
                $currentCount++;
            }
        }
    }

    /**
     * Extract URL from text (if it contains one).
     *
     * @param string $text
     * @return string
     */
    private function extractUrl(string $text): string
    {
        if (preg_match('/(https?:\/\/[^\s]+)/', $text, $matches)) {
            return $matches[1];
        }

        return $text;
    }

    /**
     * Normalize audio path by removing storage URL prefix if present.
     *
     * @param string|null $audio
     * @return string|null
     */
    private function normalizeAudioPath(?string $audio): ?string
    {
        if (!$audio) {
            return null;
        }

        $storageUrl = URL::to('/storage/');
        if (str_starts_with($audio, $storageUrl)) {
            return str_replace($storageUrl, '', $audio);
        }

        return $audio;
    }

    /**
     * Delete orphaned files from storage after a failed transaction.
     *
     * @param array $files
     * @return void
     */
    private function cleanupFiles(array $files): void
    {
        foreach ($files as $file) {
            try {
                Storage::disk('public')->delete($file);
            } catch (\Throwable $e) {
                Log::warning("Failed to cleanup orphaned file: {$file}", [
                    'error' => $e->getMessage(),
                ]);
            }
        }
    }
}
