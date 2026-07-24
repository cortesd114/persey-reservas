<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Espacios extends Model
{
    use HasFactory;

    protected $table = 'rsv_espacios';

    protected $fillable = [
        'nombre',
        'zona_id',
        'tipo_espacio_id',
        'estado_espacio_id',
        'color_fondo',
        'color_texto'
    ];

    public function zona()
    {
        return $this->belongsTo(Zonas::class, 'zona_id');
    }

    public function tipoEspacio()
    {
        return $this->belongsTo(TipoEspacios::class, 'tipo_espacio_id');
    }

    public function estadoEspacio()
    {
        return $this->belongsTo(EstadoEspacios::class, 'estado_espacio_id');
    }
}