<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class TemplateResource extends JsonResource
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
            'active' => $this->active,
            'category_id' => $this->category_id,
            'bg_img' => asset('/storage/'.$this->bg_img),
            'envelope_img' => asset('/storage/'.$this->envelope_img),
            'preview_img' => asset('/storage/'.$this->preview_img),
            'without_text' => asset('/storage/'.$this->without_text),
            'content' => $this->content,
            'price' => $this->price
        ];
    }
}
