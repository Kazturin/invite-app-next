<?php

namespace App\Models;

use Carbon\Carbon;
use Illuminate\Database\Eloquent\Casts\Attribute;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Support\Str;

class Post extends Model
{
    use HasFactory;

    protected $fillable = ['title', 'slug', 'thumbnail', 'body', 'user_id', 'active', 'published_at', 'meta_title', 'meta_description'];

    protected $casts = [
        'published_at' => 'datetime'
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function categories(): BelongsToMany
    {
        return $this->belongsToMany(Category::class);
    }

    public function shortBody($words = 30): string
    {
        return Str::words(strip_tags($this->body), $words);
    }

    public function getFormattedDate()
    {

       // dd(Carbon::)
        return $this->published_at->translatedFormat('d F Y');
    }

    public function getThumbnail()
    {
        if (str_starts_with($this->thumbnail, 'http')) {
            return $this->thumbnail;
        }

        return '/storage/' . $this->thumbnail;
    }

    // public function humanReadTime(): Attribute
    // {
    //     return new Attribute(
    //         get: function ($value, $attributes) {
    //             $words = Str::wordCount(strip_tags($attributes['body']));
    //             $minutes = ceil($words / 200);

    //             return $minutes . ' ' . str('минут') . ', '
    //                 . $words . ' ' . str('сөз');
    //         }
    //     );
    // }

    public function humanReadTime(): Attribute
    {
        return Attribute::make(
            get: function ($value, $attributes) {
                $text = strip_tags($attributes['body'] ?? '');

                preg_match_all('/[А-Яа-яӘәӨөҮүҰұҚқҢңҒғҺһІіЁёA-Za-z]+/u', $text, $matches);
                $words = count($matches[0]);

                $minutes = ceil($words / 150);

                return "{$minutes} мин, {$words} сөз";
            }
        );
    }

    protected static function boot()
{
    parent::boot();

    static::creating(function ($model) {
        if (!$model->published_at) {
            $model->published_at = now();
        }
    });
}
}
