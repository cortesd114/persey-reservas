<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use App\Models\RsvAtributosEspacios;

class RsvAtributosEspaciosController extends Controller
{
    public function store(Request $request)
    {
        $existe = RsvAtributosEspacios::where('espacio_id', $request->espacio_id)
            ->where('atributo_id', $request->atributo_id)
            ->exists();

        if ($existe) {

            return response()->json([
                'success' => false,
                'message' => 'El atributo ya está asociado a este espacio.'
            ], 400);

        }

        try {

            DB::beginTransaction();

            $atributoEspacio = new RsvAtributosEspacios();

            $atributoEspacio->espacio_id = $request->espacio_id;

            $atributoEspacio->atributo_id = $request->atributo_id;

            $atributoEspacio->save();

            DB::commit();

            return response()->json([
                'success' => true,
                'message' => 'Atributo asociado correctamente.'
            ]);

        } catch (\Exception $e) {

            DB::rollBack();

            return response()->json([
                'success' => false,
                'message' => 'Error al asociar el atributo.',
                'error' => $e->getMessage()
            ], 500);

        }
    }
}