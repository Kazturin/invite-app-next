<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Order extends Model
{
    use HasFactory;

    const STATUS_NOT_PAID = 0;
    const STATUS_PAID = 1;
    const STATUS_FREE = 2;

    protected $fillable = [
        'event_id',
        'status',
        'price',
    ];

    public function statusLabel():string{
        switch ($this->status){
            case 0: return 'Төлем жасалмаған';
            case 1: return 'Төлем жасалған';
            case 2: return 'Уақытша';
        }
        return 'null';
    }

    public function color(){
        switch ($this->status){
            case 0: return '#FF0000';
            case 1: return '#00FF00';
            case 2: return '#dd9939';
        }
        return '#000000';
    }
}
