<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class TipoEspacios extends Model
{
    use HasFactory;
    protected $table = 'rsv_tipos_espacios';
    protected $fillable = [
        'nombre',
        
    ];
}
