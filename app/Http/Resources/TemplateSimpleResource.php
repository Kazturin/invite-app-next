<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class TemplateSimpleResource extends JsonResource
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
            'preview_img' => asset('/storage/'.$this->preview_img),
            'price' => $this->price
        ];
    }
}
