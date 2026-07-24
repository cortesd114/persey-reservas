<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\DB;
use App\Models\TipoReserva;

class TipoReservaController extends Controller
{
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'nombre' => 'required|string|max:100',
            'color_fondo' => 'required|string|max:7',
            'color_texto' => 'required|string|max:7'
        ]);
        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'errors' => $validator->errors()
            ], 400);
        }
        $tipoReserva = null;

        if ($request->id) {
            $tipoReserva = TipoReserva::findOrFail($request->id);
        } else {
            $tipoReserva = new TipoReserva();
        }
        try {

            DB::beginTransaction();

            $tipoReserva->nombre = $request->nombre;
            $tipoReserva->color_fondo = $request->color_fondo;
            $tipoReserva->color_texto = $request->color_texto;

            $tipoReserva->save();

            DB::commit();

            return response()->json([
                'success' => true,
                'message' => 'Tipo de reserva guardado correctamente.',
                'data' => $tipoReserva
            ], 201);

        } catch (\Exception $e) {

            DB::rollBack();

            return response()->json([
                'success' => false,
                'message' => 'Error al guardar el tipo de reserva.',
                'error' => $e->getMessage()
            ], 500);
        }


    }

    public function show($id)
    {
        try {

            if ($id === '@') {
                $tipoReserva = TipoReserva::get();
            } else {
                $tipoReserva = TipoReserva::findOrFail($id);
            }

            return response()->json([
                'success' => true,
                'data' => $tipoReserva
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