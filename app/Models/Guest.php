<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Guest extends Model
{
    use HasFactory;

    const STATUS_REJECTED = 0;
    const STATUS_ACCEPTED = 1;

    protected $fillable = [
        'fullname',
        'relative',
        'email',
        'phone',
        'status',
        'event_id',
        'personally_invited'
    ];

    public function child(){
        return $this->hasMany(GuestChild::class);
    }

    public function invite(){
        return $this->hasOne(GuestInvite::class);
    }
}
