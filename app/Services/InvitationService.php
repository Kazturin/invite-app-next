<?php

namespace App\Services;

use App\Models\Invitation;
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
     * @param array $data
     * @return Invitation
     * @throws \Exception
     */
    public function updateInvitation(Invitation $invitation, array $data): Invitation
    {
        // Handle invitation image update
        if (isset($data['invitation_img']) && preg_match('/^data:image\/(\w+);base64,/', $data['invitation_img'])) {
            // Get envelope image path from template
            // The original code used storage_path('app/public/' . $invitation->template->envelope_img)
            Log::info('edit invitation template envelope_img: ' . $invitation->template->envelope_img);
            $envelopeImg = storage_path($invitation->template->envelope_img);

            Log::info('edit invitation envelope_img: ' . $envelopeImg);
            $relativePath = $this->imageService->saveImage($data['invitation_img'], $envelopeImg);
            $data['invitation_img'] = $relativePath;
        }

        // Handle content decoding
        if (isset($data['content']) && is_string($data['content'])) {
            $data['content'] = json_decode($data['content']);
        }

        $invitation->update($data);

        return $invitation;
    }
}
