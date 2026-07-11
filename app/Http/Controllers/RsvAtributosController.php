<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\DB;
use App\Models\RsvAtributos;


class RsvAtributosController extends Controller
{
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [

            'nombre' => 'required|string|max:100',

            'valor' => 'required',

            'required' => 'required|boolean'

        ]); 

        if ($validator->fails()) {

            return response()->json([
                'success' => false,
                'errors' => $validator->errors()
            ], 400);

        }

        // Validar nombre repetido
        $existe = RsvAtributos::where('nombre', $request->nombre)

            ->when($request->id, function ($query) use ($request) {

                $query->where('id', '!=', $request->id);

            })

            ->exists();

        if ($existe) {

            return response()->json([
                'success' => false,
                'message' => 'Ya existe un atributo con ese nombre.'
            ], 400);

        }

        if ($request->id) {

            $atributo = RsvAtributos::findOrFail($request->id);

        } else {

            $atributo = new RsvAtributos();

        }

        try {

            DB::beginTransaction();

            $atributo->nombre = $request->nombre;

            $atributo->valor = $request->valor;

            $atributo->required = $request->required;

            $atributo->save();

            DB::commit();

            return response()->json([
                'success' => true,
                'message' => 'Atributo guardado correctamente.',
                'data' => $atributo
            ], 201);

        } catch (\Exception $e) {

            DB::rollBack();

            return response()->json([
                'success' => false,
                'message' => 'Error al guardar el atributo.',
                'error' => $e->getMessage()
            ], 500);

        }
    }

    public function show($id)
    {
        try {

            if ($id === '@') {

                $atributos = RsvAtributos::get();

            } else {

                $atributos = RsvAtributos::findOrFail($id);

            }

            return response()->json([
                'success' => true,
                'data' => $atributos
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