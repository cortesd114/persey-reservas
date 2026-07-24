<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class TipoReserva extends Model
{
    use HasFactory;
    protected $table = 'rsv_tipo_reserva';
    protected $fillable = [
        'nombre',
        'color_fondo',
        'color_texto'
    ];
}
