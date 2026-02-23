<?php

namespace App\Services;

use App\Models\Address;
use App\Models\Event;
use App\Models\Invitation;
use App\Models\Order;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Validator;
use Illuminate\Validation\ValidationException;

class EventService
{
    protected $imageService;

    public function __construct(ImageService $imageService)
    {
        $this->imageService = $imageService;
    }

    /**
     * Create a new event with related models.
     *
     * @param array $data
     * @return Event
     * @throws ValidationException
     * @throws \Exception
     */
    public function createEvent(array $data): Event
    {
        try {
            DB::beginTransaction();

            $validator = Validator::make($data['invitation'], [
                'invitation_img' => 'required',
                'envelope_img' => 'required',
                'content' => 'required',
                'template_id' => 'required',
                'price' => 'required',
                'inInvitationImage' => 'nullable',
                'bg_img' => 'nullable'
            ], [
                'invitation_img.required' => 'Бірінші қадам сақталмады, қайтадан бірінші қадамға өтіңіз.',
                'envelope_img.required' => 'Бірінші қадам сақталмады, қайтадан бірінші қадамға өтіңіз.',
                'template_Id.required' => 'Бірінші қадам сақталмады, қайтадан бірінші қадамға өтіңіз.'
            ]);
            $invitationValidated = $validator->validated();

            Log::info('envelope_img: ' . $invitationValidated['envelope_img']);
            if (preg_match('/^data:image\/(\w+);base64,/', $invitationValidated['invitation_img'], $type)) {
                $relativePath = $this->imageService->saveImage($invitationValidated['invitation_img'], $invitationValidated['envelope_img']);
                $invitationValidated['invitation_img'] = $relativePath;
                Log::info('saved');
            }

            if (isset($data['audioFile']) && $data['audioFile'] instanceof \Illuminate\Http\UploadedFile) {
                $data['audio'] = $data['audioFile']->store('audio', 'public');
            } elseif (isset($data['audio'])) {
                $data['audio'] = $this->normalizeAudioPath($data['audio']);
            }

            $event = Event::create($data);

            Order::create([
                'event_id' => $event->id,
                'status' => Order::STATUS_NOT_PAID,
                'price' => $invitationValidated['price']
            ]);

            $data['address']['event_id'] = $event->id;

            if (isset($data['address']['address']) && preg_match('/(https?:\/\/[^\s]+)/', $data['address']['address'], $matches)) {
                $data['address']['address'] = $matches[1];
            }

            Address::create($data['address']);

            Invitation::create([
                'invitation_img' => $invitationValidated['invitation_img'],
                'event_id' => $event->id,
                'content' => json_decode($invitationValidated['content']),
                'template_id' => $invitationValidated['template_id'],
                'bg_img' => $invitationValidated['bg_img'],
            ]);

            if (isset($data['gallery']) && is_array($data['gallery'])) {
                foreach ($data['gallery'] as $image) {
                    if ($image instanceof \Illuminate\Http\UploadedFile) {
                        $path = $image->store('event_images', 'public');
                        $event->images()->create(['path' => $path]);
                    }
                }
            }

            DB::commit();

            return $event;
        } catch (ValidationException $exception) {
            DB::rollBack();
            throw $exception;
        } catch (\Exception $e) {
            DB::rollBack();
            Log::error($e->getMessage() . ' ' . $e->getLine() . ' ' . $e->getFile());
            throw $e;
        }
    }

    /**
     * Update an existing event.
     *
     * @param Event $event
     * @param array $data
     * @return Event
     */
    public function updateEvent(Event $event, array $data): Event
    {
        if (isset($data['audioFile']) && $data['audioFile'] instanceof \Illuminate\Http\UploadedFile) {
            $data['audio'] = $data['audioFile']->store('audio', 'public');
        } elseif (isset($data['audio'])) {
            $data['audio'] = $this->normalizeAudioPath($data['audio']);
        }

        $event->update($data);

        if (isset($data['address'])) {
            if (isset($data['address']['address']) && preg_match('/(https?:\/\/[^\s]+)/', $data['address']['address'], $matches)) {
                $data['address']['address'] = $matches[1];
            }

            $validator = Validator::make($data['address'], [
                'address' => 'required',
                'lat' => 'required',
                'long' => 'required',
            ]);

            $event->address()->update($validator->validated());
        }

        if (isset($data['gallery']) && is_array($data['gallery'])) {
            // Check if we need to remove existing images (if logic requires replacing all or specific ones)
            // For now, let's assume appending new ones, or user might need a way to delete specific ones.
            // The requirement says "upload multiple images", usually implies adding.
            // But if there is a limit of 5, we should check count.
            
            $currentCount = $event->images()->count();
            foreach ($data['gallery'] as $image) {
                if ($currentCount >= 5) break; 
                if ($image instanceof \Illuminate\Http\UploadedFile) {
                    $path = $image->store('event_images', 'public');
                    $event->images()->create(['path' => $path]);
                    $currentCount++;
                }
            }
        }

        return $event;
    }

    /**
     * Delete an event and its associated images.
     *
     * @param Event $event
     * @return void
     */
    public function deleteEvent(Event $event): void
    {
        if ($event->invitation?->invitation_img) {
            $originalPath = $event->invitation->invitation_img;
            $miniPath = 'images/invitations/620x640/' . basename($originalPath);

            Storage::disk('public')->delete($originalPath);
            Storage::disk('public')->delete($miniPath);
        }

        $event->delete();
    }

    /**
     * Normalize audio path by removing storage URL prefix if present.
     *
     * @param string|null $audio
     * @return string|null
     */
    protected function normalizeAudioPath(?string $audio): ?string
    {
        if (!$audio) return null;

        $storageUrl = \Illuminate\Support\Facades\URL::to('/storage/');
        if (str_starts_with($audio, $storageUrl)) {
            return str_replace($storageUrl, '', $audio);
        }

        return $audio;
    }
}
