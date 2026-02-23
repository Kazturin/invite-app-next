<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\URL;
use Spatie\Sluggable\HasSlug;
use Spatie\Sluggable\SlugOptions;
use Illuminate\Support\Facades\Storage;

class Event extends Model
{
    use HasFactory, HasSlug;

    const STATUS_NOT_PAID = 0;
    const STATUS_PAID = 1;
    const STATUS_DELETED = 2;

    protected $fillable = [
        'title',
        'slug',
        'description',
        'hashtag',
        'place',
        'date',
        'video_link',
        'photos_link',
        'audio',
        'status',
        'created_by'
    ];


    public function getSlugOptions(): SlugOptions
    {
        return SlugOptions::create()
            ->generateSlugsFrom('title')
            ->saveSlugsTo('slug');
    }

    public function invitation(){
        return $this->hasOne(Invitation::class);
    }

    public function guests(){
        return $this->hasMany(Guest::class);
    }

    public function address()
    {
        return $this->hasOne(Address::class);
    }

    public function order()
    {
        return $this->hasOne(Order::class, 'event_id', 'id');
        // return $this->belongsTo(Order::class,'id', 'event_id');
    }

    public function user(){
        return $this->belongsTo(User::class,'created_by');
    }

    public function getAudio(){
        if (!$this->audio) return null;
        if (filter_var($this->audio, FILTER_VALIDATE_URL)) {
            return $this->audio;
        }
        return URL::to('/storage/'.$this->audio);
    }

    public function images()
    {
        return $this->hasMany(EventImage::class);
    }

    protected static function booted(): void
    {
        static::deleting(function (Event $event) {
            $file = $event->invitation?->invitation_img;
            if($file && Storage::disk('public')->exists($file)){
                Storage::disk('public')->delete($file);
            }
        });
    }

}
