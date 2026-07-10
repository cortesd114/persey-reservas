<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class EstadoEspacios extends Model
{
    use HasFactory;
    protected $table = 'rsv_estados_espacios';
    protected $fillable = [
        'nombre'
    ];
}
