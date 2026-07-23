<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use App\Models\RsvAtributos;
use App\Models\RsvAtributosEspacios;

class RsvAtributosEspaciosController extends Controller
{

    public function store(Request $request)
    {

        try {

            DB::beginTransaction();

            //Buscar todos los atributos del espacio
            $atributosEspacio = RsvAtributosEspacios::where(
                'espacio_id',
                $request->espacio_id
            )->get();


            $atributo = null;


            //Buscar si el atributo ya existe para este espacio
            foreach ($atributosEspacio as $item) {

                $atributoConsultado = RsvAtributos::find(
                    $item->atributo_id
                );

                if (
                    $atributoConsultado &&
                    $atributoConsultado->nombre == $request->nombre
                ) {

                    $atributo = $atributoConsultado;
                    break;

                }

            }


            //Si existe se actualiza
            if ($atributo) {

                $atributo->valor = $request->valor;
                $atributo->required = $request->required;
                $atributo->save();

            }

            //Si no existe se crea
            else {

                $atributo = RsvAtributos::create([

                    'nombre' => $request->nombre,
                    'valor' => $request->valor,
                    'required' => $request->required

                ]);


                //Crear la relación únicamente si es un atributo nuevo
                RsvAtributosEspacios::create([

                    'espacio_id' => $request->espacio_id,
                    'atributo_id' => $atributo->id

                ]);

            }


            DB::commit();

            return response()->json([

                'success' => true,
                'message' => 'Atributo guardado correctamente.'

            ]);

        } catch (\Exception $e) {

            DB::rollBack();

            return response()->json([

                'success' => false,
                'message' => 'Ha ocurrido un error al registrar el atributo.',
                'error' => $e->getMessage()

            ], 500);

        }

    }
    public function show($id)
    {

        $atributos = RsvAtributosEspacios::where(
            'espacio_id',
            $id
        )->get();


        $resultado = [];


        foreach ($atributos as $atributo) {

            $atributoConsultado = RsvAtributos::find(
                $atributo->atributo_id
            );


            $resultado[] = [

                'id' => $atributoConsultado->id,
                'nombre' => $atributoConsultado->nombre,
                'valor' => $atributoConsultado->valor,
                'required' => $atributoConsultado->required

            ];

        }


        return response()->json([

            'success' => true,
            'data' => $resultado,
        ]);


    }
}

