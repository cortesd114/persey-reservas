<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class RsvAtributos extends Model
{
    use HasFactory;
    protected $table = 'rsv_atributos';
    protected $fillable = [
        'nombre',
        'valor',
        'required'
    ];
    public $timestamps = false; 
}
