<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class GuestResource extends JsonResource
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
          'fullname' => $this->fullname,
          'relative' => $this->relative,
          'email' => $this->email,
          'phone' => $this->phone,
          'status' => $this->status,
          'event_id' => $this->event_id,
          'child' => $this->child,
          'personally_invited' => $this->personally_invited,
          'invite' => $this->invite,
        ];
    }
}
