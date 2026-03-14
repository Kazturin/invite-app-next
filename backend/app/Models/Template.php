<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Support\Facades\Cache;

class Template extends Model
{
    use HasFactory;

    protected $fillable = [
        'category_id',
        'active',
        'bg_img',
        'envelope_img',
        'without_text',
        'preview_img',
        'content',
        'price',
    ];

    protected $casts = [
        'content' => 'array',
    ];

    public function category(): BelongsTo 
    {
        return $this->belongsTo(TemplateCategory::class, 'category_id');
    }

    protected static function boot()
    {
        parent::boot();
 
        static::created(function () {
            Cache::forget('template_categories');
        });
 
        static::updated(function () {
            Cache::forget('template_categories');
        });
        static::deleted(function () {
            Cache::forget('template_categories');
        });
    }

    
}
