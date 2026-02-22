<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use Illuminate\Support\Facades\URL;

class InvitationResource extends JsonResource
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
          'invitation_img' => $this->invitation_img ? URL::to('/storage/'.$this->invitation_img) : null,
          'invitation_img_path' => $this->invitation_img,
          'event_id' => $this->event_id,
          'content' => $this->content,
          'template_id' => $this->template_id,
          'bg_img' => $this->bg_img ?: '/images/bg/1.jpg',
          'template' => new TemplateResource($this->template),
        ];
    }
}
