<?php

namespace App\Http\Resources;

use App\Models\Guest;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class GuestInviteResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
          'id' => $this->id,
          'guest_id' => $this->guest_id,
          'invite_text' => $this->invite_text,
          'invite_code' => $this->invite_code,
          'guest' => GuestResource::make($this->guest),
        ];
    }
}
