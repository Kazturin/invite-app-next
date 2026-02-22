<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Survey extends Model
{
    protected $fillable = ['question', 'options'];
    protected $casts = ['options' => 'array'];

    public function answers()
    {
        return $this->hasMany(SurveyAnswer::class);
    }
}
