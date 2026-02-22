<?php

namespace App\Http\Resources;

use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class EventResource extends JsonResource
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
            'title' => $this->title,
            'slug' => $this->slug,
            'description' => $this->description,
            'hashtag' => $this->hashtag,
            'address' => $this->address,
            'place' => $this->place,
            'date' => Carbon::parse($this->date)->format('Y-m-d H:i'),
            'status' => $this->status,
            'created_by' => $this->created_by,
            'video_link' => $this->video_link,
            'photos_link' => $this->photos_link,
            'audio' => $this->getAudio(),
            'images' => EventImageResource::collection($this->images),
            'invitation' => new InvitationResource($this->invitation),
            'order' => new OrderResource($this->order)
        ];
    }
}
