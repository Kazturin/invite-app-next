<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class GuestInvite extends Model
{
    public $timestamps = false;
    protected $fillable = [
        'guest_id',
        'invite_text',
        'invite_code',
    ];

    public function guest()
    {
        return $this->belongsTo(Guest::class);
    }
}
