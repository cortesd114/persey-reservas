<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\DB;
use App\Models\TipoEspacios;

class TipoEspaciosController extends Controller
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
        $TipoEspacios = null;

        if ($request->id) {
            $TipoEspacios = TipoEspacios::findOrFail($request->id);
        } else {
            $TipoEspacios = new TipoEspacios();
        }
        try {

            DB::beginTransaction();

            $TipoEspacios->nombre = $request->nombre;
            

            $TipoEspacios->save();

            DB::commit();

            return response()->json([
                'success' => true,
                'message' => 'Tipo de espacio guardado correctamente.',
                'data' => $TipoEspacios
            ], 201);

        } catch (\Exception $e) {

            DB::rollBack();

            return response()->json([
                'success' => false,
                'message' => 'Error al guardar tipo de espacios.',
                'error' => $e->getMessage()
            ], 500);
        }


    }

    public function show($id)
    {
        try {

            if ($id === '@') {
                $TipoEspacios = TipoEspacios::get();
            } else {
                $TipoEspacios = TipoEspacios::findOrFail($id);
            }

            return response()->json([
                'success' => true,
                'data' => $TipoEspacios
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