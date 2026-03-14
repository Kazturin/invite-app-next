<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\InvitationRequest;
use App\Http\Resources\InvitationResource;
use App\Models\Invitation;
use App\Services\ImageService;
use App\Services\InvitationService;
use Illuminate\Http\Request;

class InvitationController extends Controller
{
    protected $invitationService;
    protected $imageService;

    public function __construct(InvitationService $invitationService, ImageService $imageService)
    {
        $this->invitationService = $invitationService;
        $this->imageService = $imageService;
    }

    public function show(Invitation $invitation)
    {
        $this->authorize('view', $invitation);
        return new InvitationResource($invitation);
    }

    public function update(InvitationRequest $request, Invitation $invitation)
    {
        $this->authorize('update', $invitation);

        $invitation = $this->invitationService->updateInvitation($invitation, $request->validated());

        return new InvitationResource($invitation);
    }

    /**
     * Добавляет водяной знак на изображение.
     *
     * @param string $url
     * @return string (Data URL)
     */
    public function invitationWithWatermark($url)
    {
        return $this->imageService->addWatermark($url);
    }
}