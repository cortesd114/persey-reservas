<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\DB;
use App\Models\EstadoReserva;

class EstadoReservaController extends Controller
{
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'nombre' => 'required|string|max:150',
            'ocupado' => 'required|boolean'
        ]);
        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'errors' => $validator->errors()
            ], 400);
        }
        $EstadoReserva = null;

        if ($request->id) {
            $EstadoReserva = EstadoReserva::findOrFail($request->id);
        } else {
            $EstadoReserva = new EstadoReserva();
        }
        try {

            DB::beginTransaction();

            $EstadoReserva->nombre = $request->nombre;
            $EstadoReserva->ocupado = $request->ocupado;

            $EstadoReserva->save();

            DB::commit();

            return response()->json([
                'success' => true,
                'message' => 'Estado de reserva guardado correctamente.',
                'data' => $EstadoReserva
            ], 201);

        } catch (\Exception $e) {

            DB::rollBack();

            return response()->json([
                'success' => false,
                'message' => 'Error al guardar el estado de reserva.',
                'error' => $e->getMessage()
            ], 500);
        }


    }

    public function show($id)
    {
        try {

            if ($id === '@') {
                $EstadoReserva = EstadoReserva::get();
            } else {
                $EstadoReserva = EstadoReserva::findOrFail($id);
            }

            return response()->json([
                'success' => true,
                'data' => $EstadoReserva
            ], 200);

        } catch (\Exception $e) {

            return response()->json([
                'success' => false,
                'message' => 'Error al consultar los datos.',
                'error' => $e->getMessage()
            ], 500);

        }
    }
}