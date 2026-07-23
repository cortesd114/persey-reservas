<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\TipoReservaController;
use App\Http\Controllers\EstadoReservaController;
use App\Http\Controllers\ZonasController;
use App\Http\Controllers\EstadoEspaciosController;
use App\Http\Controllers\TipoEspaciosController;
use App\Http\Controllers\EspaciosController;
use App\Http\Controllers\RsvAtributosController;
use App\Http\Controllers\RsvAtributosEspaciosController;

Route::get('/', function () {
    return view('welcome');
});

Route::get('/tipoReserva', function () {
    return view('tipoReserva');
});

Route::get('/tipoReserva/{id}', [TipoReservaController::class, 'show']);

Route::post('/tipoReserva', [TipoReservaController::class, 'store']);


Route::get('/zonas', function () {
    return view('zonas');
});

Route::get('/zonas/{id}', [ZonasController::class, 'show']);

Route::post('/zonas', [ZonasController::class, 'store']);


Route::get('/estadoReserva', function () {
    return view('estadoReserva');
});

Route::get('/estadoReserva/{id}', [EstadoReservaController::class, 'show']);

Route::post('/estadoReserva', [EstadoReservaController::class, 'store']);

Route::get('/estadoEspacios', function () {
    return view('estadoEspacios');
});

Route::get('/estadoEspacios/{id}', [EstadoEspaciosController::class, 'show']);

Route::post('/estadoEspacios', [EstadoEspaciosController::class, 'store']);

Route::get('/tipoEspacios', function () {
    return view('tipoEspacios');
});

Route::get('/tipoEspacios/{id}', [TipoEspaciosController::class, 'show']);

Route::post('/tipoEspacios', [TipoEspaciosController::class, 'store']);


Route::get('/espacios', function () {
    return view('espacios');
});


Route::get('/espacios/{id}', [EspaciosController::class, 'show']);

Route::post('/espacios', [EspaciosController::class, 'store']);


Route::get('/atributos', function () {
    return view('atributos');
});

Route::get('/atributos/{id}', [RsvAtributosController::class, 'show']);

Route::post('/atributos', [RsvAtributosController::class, 'store']);

Route::post('/atributosEspacios', [RsvAtributosEspaciosController::class, 'store']);

Route::get(
    '/atributosEspacios/{id}',
    [RsvAtributosEspaciosController::class, 'show']
);