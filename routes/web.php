<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\TipoReservaController;

Route::get('/', function () {
    return view('welcome');
});

Route::get('/tipoReserva', function () {
    return view('tipoReserva');
});

Route::get('/tipoReserva/{id}', [TipoReservaController::class, 'show']);

Route::post('/tipoReserva', [TipoReservaController::class, 'store']);

