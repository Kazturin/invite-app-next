<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;

class TemplateCategory extends Model
{
    use HasFactory;

    protected $fillable = [
        'title_kk',
        'title_ru'
    ];

    public function templates(): HasMany
    {
        return $this->hasMany(Template::class,'category_id')->where('active',true);
    }

    public $timestamps = false;
}
