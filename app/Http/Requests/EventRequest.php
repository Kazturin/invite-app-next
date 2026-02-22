<?php

namespace App\Http\Requests;

use App\Rules\YoutubeValidLink;
use Illuminate\Foundation\Http\FormRequest;

class EventRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, \Illuminate\Contracts\Validation\ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'title' => 'required|string:max:255',
            'description' => 'nullable|string',
            'place' => 'required|string',
            'address' => 'required|array',
            'photos_link' => 'nullable|string',
            'created_by' => 'exists:users,id',
            'audio' => 'nullable|string',
            'date' => 'required|date|after:tomorrow',
            'video_link' => ['nullable',new YoutubeValidLink()],
            'audioFile' => 'nullable|file|mimes:mp3',
            'gallery' => 'nullable|array|max:5',
            'gallery.*' => 'image|mimes:jpeg,png,jpg,gif,svg|max:5120',
            'invitation' => $this->isMethod('put') ? 'nullable|array' : 'required|array',
            'inInvitationImage' => 'nullable'
        ];
    }

    public function withValidator($validator)
    {
 \Illuminate\Support\Facades\Log::error($validator->errors());
        $validator->after(function ($validator) {
            if ($this->hasFile('gallery')) {
                 \Illuminate\Support\Facades\Log::error($this->file('gallery'));
                foreach ($this->file('gallery') as $key => $file) {
                    if (!$file->isValid()) {
                         \Illuminate\Support\Facades\Log::error("File upload error for gallery index $key: " . $file->getErrorMessage());
                         throw \Illuminate\Validation\ValidationException::withMessages([
                             "gallery.$key" => "Upload failed. PHP Error Code: " . $file->getError() . ". Message: " . $file->getErrorMessage()
                         ]);
                    }
                }
            }
        });
    }
}
