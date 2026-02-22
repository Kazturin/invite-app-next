<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class TemplateCategoryResource extends JsonResource
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
            'title_kk' => $this->title_kk,
            'title_ru' => $this->title_kk,
            'templates' =>  TemplateSimpleResource::collection($this->templates),
        ];
    }
}
