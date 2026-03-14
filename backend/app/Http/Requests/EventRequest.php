<?php

namespace App\Http\Requests;

use App\Rules\YoutubeValidLink;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Facades\Log;

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
        $isCreate = $this->isMethod('post');

        return [
            // Event fields
            'title' => 'required|string|max:255',
            'type' => 'required|string|in:wedding,party',
            'description' => 'nullable|string',
            'place' => 'required|string',
            'date' => 'required|date|after:tomorrow',
            'video_link' => ['nullable', new YoutubeValidLink()],
            'photos_link' => 'nullable|string',
            'created_by' => 'exists:users,id',
            'status' => 'nullable|integer',

            // Audio
            'audio' => 'nullable|string',
            'audioFile' => 'nullable|file|mimes:mp3|max:10240',

            // Address
            'address' => 'required|array',
            'address.address' => 'required|string',
            'address.lat' => 'required',
            'address.long' => 'required',

            // Gallery
            'gallery' => 'nullable|array|max:5',
            'gallery.*' => 'image|mimes:jpeg,png,jpg,gif,svg|max:5120',

            // Invitation (required only on create, not sent on update)
            'invitation' => $isCreate ? 'required|array' : 'nullable|array',
            'invitation.invitation_img' => $isCreate ? 'required' : 'nullable',
            'invitation.envelope_img' => $isCreate ? 'required' : 'nullable',
            'invitation.content' => $isCreate ? 'required' : 'nullable',
            'invitation.template_id' => $isCreate ? 'required' : 'nullable',
            'invitation.price' => $isCreate ? 'required' : 'nullable',
            'invitation.bg_img' => 'nullable',

            'inInvitationImage' => 'nullable',
        ];
    }

    /**
     * Custom validation messages.
     */
    public function messages(): array
    {
        return [
            // Gallery messages
            'gallery.max' => __('validation.custom.gallery.max_items'),
            'gallery.*.max' => __('validation.custom.gallery.max_size'),
            'gallery.*.image' => __('validation.custom.gallery.image'),
            'gallery.*.mimes' => __('validation.custom.gallery.mimes'),

            // Invitation messages — tells the user to go back to step 1
            'invitation.invitation_img.required' => __('validation.custom.invitation.step1_not_saved'),
            'invitation.envelope_img.required' => __('validation.custom.invitation.step1_not_saved'),
            'invitation.content.required' => __('validation.custom.invitation.step1_not_saved'),
            'invitation.template_id.required' => __('validation.custom.invitation.step1_not_saved'),
            'invitation.price.required' => __('validation.custom.invitation.step1_not_saved'),
        ];
    }

    public function withValidator($validator)
    {
        $validator->after(function ($validator) {
            if ($this->hasFile('gallery')) {
                foreach ($this->file('gallery') as $key => $file) {
                    if (!$file->isValid()) {
                        Log::warning("File upload error for gallery index $key: " . $file->getErrorMessage());
                        $validator->errors()->add(
                            "gallery.{$key}",
                            __('validation.custom.gallery.upload_failed')
                        );
                    }
                }
            }
        });
    }
}
