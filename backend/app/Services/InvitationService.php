<?php

namespace App\Services;

use App\Models\Invitation;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;

class InvitationService
{
    protected $imageService;

    public function __construct(ImageService $imageService)
    {
        $this->imageService = $imageService;
    }

    /**
     * Update an invitation.
     *
     * @param Invitation $invitation
     * @param array $data Validated data from InvitationRequest
     * @return Invitation
     * @throws \Exception
     */
    public function updateInvitation(Invitation $invitation, array $data): Invitation
    {
        $savedFiles = [];

        try {
            DB::beginTransaction();

            // Handle invitation image update (base64 → file)
            if (isset($data['invitation_img']) && preg_match('/^data:image\/(\w+);base64,/', $data['invitation_img'])) {
                // Get envelope path from template
                $envelopePath = $invitation->template->envelope_img;
                
                // If it's a relative path in storage, get full path
                if (!str_starts_with($envelopePath, '/') && !str_starts_with($envelopePath, 'http')) {
                    $envelopePath = storage_path('app/public/' . $envelopePath);
                }

                $relativePath = $this->imageService->saveImage($data['invitation_img'], $envelopePath);
                $data['invitation_img'] = $relativePath;
                $savedFiles[] = $relativePath;
            }

            // Handle content decoding if passed as JSON string
            if (isset($data['content']) && is_string($data['content'])) {
                $data['content'] = json_decode($data['content'], true);
            }

            // Update only allowed fields
            $invitation->update([
                'invitation_img' => $data['invitation_img'] ?? $invitation->invitation_img,
                'content' => $data['content'] ?? $invitation->content,
                'template_id' => $data['template_id'] ?? $invitation->template_id,
                'bg_img' => $data['bg_img'] ?? $invitation->bg_img,
            ]);

            DB::commit();

            return $invitation;
        } catch (\Exception $e) {
            DB::rollBack();
            $this->cleanupFiles($savedFiles);
            Log::error('Invitation update failed: ' . $e->getMessage(), [
                'invitation_id' => $invitation->id,
                'line' => $e->getLine()
            ]);
            throw $e;
        }
    }

    /**
     * Delete orphaned files from storage after a failed update.
     */
    private function cleanupFiles(array $files): void
    {
        foreach ($files as $file) {
            try {
                Storage::disk('public')->delete($file);
            } catch (\Throwable $e) {
                Log::warning("Failed to cleanup orphaned invitation file: {$file}");
            }
        }
    }
}

