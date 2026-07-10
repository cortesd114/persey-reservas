<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\DB;
use App\Models\Espacios;

class EspaciosController extends Controller
{
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [

            'nombre' => 'required|string|max:150',

            'zona_id' => 'required|exists:rsv_zonas,id',

            'tipo_espacio_id' => 'required|exists:rsv_tipos_espacios,id',

            'estado_espacio_id' => 'required|exists:rsv_estados_espacios,id'

        ]);

        if ($validator->fails()) {

            return response()->json([
                'success' => false,
                'errors' => $validator->errors()
            ], 400);

        }

        $espacio = null;

        if ($request->id) {

            $espacio = Espacios::findOrFail($request->id);

        } else {

            $espacio = new Espacios();

        }

        try {

            DB::beginTransaction();

            $espacio->nombre = $request->nombre;

            $espacio->zona_id = $request->zona_id;

            $espacio->tipo_espacio_id = $request->tipo_espacio_id;

            $espacio->estado_espacio_id = $request->estado_espacio_id;

            $espacio->save();

            DB::commit();

            return response()->json([
                'success' => true,
                'message' => 'Espacio guardado correctamente.',
                'data' => $espacio
            ], 201);

        } catch (\Exception $e) {

            DB::rollBack();

            return response()->json([
                'success' => false,
                'message' => 'Error al guardar el espacio.',
                'error' => $e->getMessage()
            ], 500);

        }
    }

    public function show($id)
    {
        try {

            if ($id === '@') {

                $espacios = Espacios::with([
                    'zona',
                    'tipoEspacio',
                    'estadoEspacio'
                ])->get();

            } else {

                $espacios = Espacios::findOrFail($id);

            }

            return response()->json([
                'success' => true,
                'data' => $espacios
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