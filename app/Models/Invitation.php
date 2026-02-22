<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Facades\Storage;

class Invitation extends Model
{
    use HasFactory;

    public $timestamps = false;

    protected $fillable = [
        'bg_img',
        'envelope_img',
        'invitation_img',
        'content',
        'event_id',
        'template_id'
    ];

    protected $casts = [
        'content' => 'array'
    ];

    public function template(): BelongsTo
    {
        return $this->belongsTo(Template::class, 'template_id');
    }

    public function event(): BelongsTo
    {
        return $this->belongsTo(Event::class, 'event_id');
    }

}
