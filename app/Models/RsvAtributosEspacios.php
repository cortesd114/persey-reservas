<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class RsvAtributosEspacios extends Model
{
    use HasFactory;

    protected $table = 'rsv_atributos_espacios';

    protected $fillable = [
        'espacio_id',
        'atributo_id'
    ];
}

