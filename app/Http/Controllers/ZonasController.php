<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\DB;
use App\Models\Zonas;

class ZonasController extends Controller
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
        $Zonas = null;

        if ($request->id) {
            $Zonas = Zonas::findOrFail($request->id);
        } else {
            $Zonas = new Zonas();
        }
        try {

            DB::beginTransaction();

            $Zonas->nombre = $request->nombre;
            

            $Zonas->save();

            DB::commit();

            return response()->json([
                'success' => true,
                'message' => 'Zona guardada correctamente.',
                'data' => $Zonas
            ], 201);

        } catch (\Exception $e) {

            DB::rollBack();

            return response()->json([
                'success' => false,
                'message' => 'Error al guardar zona.',
                'error' => $e->getMessage()
            ], 500);
        }


    }

    public function show($id)
    {
        try {

            if ($id === '@') {
                $Zonas = Zonas::get();
            } else {
                $Zonas = Zonas::findOrFail($id);
            }

            return response()->json([
                'success' => true,
                'data' => $Zonas
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