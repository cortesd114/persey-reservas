<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\DB;
use App\Models\EstadoEspacios;

class EstadoEspaciosController extends Controller
{
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'nombre' => 'required|string|max:100'
        ]);
        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'errors' => $validator->errors()
            ], 400);
        }
        $EstadoEspacios = null;

        if ($request->id) {
            $EstadoEspacios = EstadoEspacios::findOrFail($request->id);
        } else {
            $EstadoEspacios = new EstadoEspacios();
        }
        try {

            DB::beginTransaction();

            $EstadoEspacios->nombre = $request->nombre;
            

            $EstadoEspacios->save();

            DB::commit();

            return response()->json([
                'success' => true,
                'message' => 'Estado Espacio guardado correctamente.',
                'data' => $EstadoEspacios
            ], 201);

        } catch (\Exception $e) {

            DB::rollBack();

            return response()->json([
                'success' => false,
                'message' => 'Error al guardar estado de espacio.',
                'error' => $e->getMessage()
            ], 500);
        }


    }

    public function show($id)
    {
        try {

            if ($id === '@') {
                $EstadoEspacios = EstadoEspacios::get();
            } else {
                $EstadoEspacios = EstadoEspacios::findOrFail($id);
            }

            return response()->json([
                'success' => true,
                'data' => $EstadoEspacios
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