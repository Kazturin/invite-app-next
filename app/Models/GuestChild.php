<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class GuestChild extends Model
{
    use HasFactory;

    public $timestamps = false;

    protected $fillable = [
        'fullname',
        'guest_id',
    ];

    public function guest()
{
    return $this->belongsTo(Guest::class);
}
}
