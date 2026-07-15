<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta name="csrf-token" content="{{ csrf_token() }}">
    <title>Espacios</title>

    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css">
    <link rel="stylesheet" href="{{ asset('css/bootstrap5-compat.css') }}?v=5">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/timepicker/1.3.5/jquery.timepicker.min.css">
    <link rel="stylesheet" href="https://cdn.datatables.net/1.13.8/css/jquery.dataTables.min.css">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css">
    <link rel="stylesheet" href="{{asset('css/bootstrap-datetimepicker.css')}}">

    <style>
        .content-input input,
        .content-select select {
            appearance: none;
            -webkit-appearance: none;
            -moz-appearance: none;
        }

        .content-input input {
            visibility: hidden;
            position: absolute;
            right: 0;
        }

        .content-input {
            position: relative;
            margin-bottom: 30px;
            padding: 5px 0 5px 60px;
            /* Damos un padding de 60px para posicionar
        el elemento <i> en este espacio*/
            display: block;
        }

        /* Estas reglas se aplicarán a todos las elementos i
    después de cualquier input*/
        .content-input input+i {
            background: #f0f0f0;
            border: 2px solid rgba(0, 0, 0, 0.2);
            position: absolute;
            left: 0;
            top: 0;
        }

        /* Estas reglas se aplicarán a todos los i despues
    de un input de tipo checkbox*/
        .content-input input[type=checkbox]+i {
            width: 52px;
            height: 30px;
            border-radius: 15px;
        }

        /*
    Creamos el círculo que aparece encima de los checkbox
    con la etqieta before. Importante aunque no haya contenido
    debemos poner definir este valor.
    */
        .content-input input[type=checkbox]+i:before {
            content: '';
            /* No hay contenido */
            width: 26px;
            height: 26px;
            background: #fff;
            border-radius: 50%;
            position: absolute;
            z-index: 1;
            left: 0px;
            top: 0px;
            -webkit-box-shadow: 3px 0 3px 0 rgba(0, 0, 0, 0.2);
            box-shadow: 3px 0 3px 0 rgba(0, 0, 0, 0.2);
        }

        .content-input input[type=checkbox]:checked+i:before {
            left: 22px;
            -webkit-box-shadow: -3px 0 3px 0 rgba(0, 0, 0, 0.2);
            box-shadow: 3px 0 -3px 0 rgba(0, 0, 0, 0.2);
        }

        .content-input input[type=checkbox]:checked+i {
            background: #2AC176;
        }

        .swal-text {
            text-align: center;
        }

        .obligatorio::after {
            content: " *";
            color: red;
        }

        .regla {
            display: flex;
            gap: 2rem;
            justify-content: center;
            align-items: center;
        }

        .modal-body {
            display: flex;
            flex-direction: column;
            gap: 0.5rem;
        }

        .textOverflow {
            max-width: 180ch;
            overflow-wrap: break-word;
            white-space: pre-line;
        }



        /* The switch - the box around the slider */
        .switch {
            position: relative;
            display: inline-block;
            width: 60px;
            height: 34px;
        }

        /* Hide default HTML checkbox */
        .switch input {
            opacity: 0;
            width: 0;
            height: 0;
        }

        /* The slider */
        .slider {
            position: absolute;
            cursor: pointer;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background-color: #ccc;
            -webkit-transition: .4s;
            transition: .4s;
        }

        .slider:before {
            position: absolute;
            content: "";
            height: 26px;
            width: 26px;
            left: 4px;
            bottom: 4px;
            background-color: white;
            -webkit-transition: .4s;
            transition: .4s;
        }

        input:checked+.slider {
            background-color: #2196F3;
        }

        input:focus+.slider {
            box-shadow: 0 0 1px #2196F3;
        }

        input:checked+.slider:before {
            -webkit-transform: translateX(26px);
            -ms-transform: translateX(26px);
            transform: translateX(26px);
        }

        /* Rounded sliders */
        .slider.round {
            border-radius: 34px;
        }

        .slider.round:before {
            border-radius: 50%;
        }

        #config.modal.show .modal-dialog,
        #configAtributos.modal.show .modal-dialog {
            animation: entrada-modal-espacios .3s ease-out;
        }

        @keyframes entrada-modal-espacios {
            from {
                opacity: 0;
            }

            to {
                opacity: 1;
            }
        }
    </style>
</head>

<body>
    <div class="row">
        <div class="col-md-12 text-center" style="margin-top:2%;">
            <div class="container" style="width: 99%;">

                <div class="row">

                    <div class="col-md-12 text-center" style="margin-top:2%;">

                        <div class="row">

                            <div class="col-md-12">

                                <div class="panel panel-default">

                                    <div class="panel-heading">

                                        <h3 class="text-uppercase">
                                            Espacios
                                        </h3>

                                        <p>
                                            <b>Crear y modificar los espacios.</b>
                                        </p>

                                        <div class="text-end">




                                            <button type="button" id="nuevoRegistro" class="btn btn-success"
                                                style="padding:9px;">

                                                Nuevo

                                            </button>
                                        </div>
                                    </div>

                                    <div class="panel-body panel-block">

                                        <table id="tabla"
                                            class="table table-striped table-bordered dt-responsive text-center">

                                            <thead>

                                                <tr>

                                                    <th style="width:5%;">
                                                        ID
                                                    </th>

                                                    <th style="width:20%; text-align:left;">
                                                        Nombre
                                                    </th>

                                                    <th style="width:20%; text-align:left;">
                                                        Zona
                                                    </th>

                                                    <th style="width:20%;">
                                                        Tipo
                                                    </th>

                                                    <th style="width:20%;">
                                                        Estado
                                                    </th>

                                                    <th style="width:10%;">
                                                        Acciones
                                                    </th>

                                                </tr>

                                            </thead>

                                        </table>

                                    </div>

                                </div>

                            </div>

                        </div>

                    </div>

                </div>

            </div>
            <div class="row">

            </div>
        </div>
    </div>

    <div class="modal fade bd-example-modal-lg" id="config" data-bs-backdrop="static" data-bs-keyboard="false" role="dialog">

        <div class="modal-dialog modal-lg">

            <section id="form" class="modal-content">

                <div class="container" style="width:99%;">

                    <div class="row">

                        <div class="col-md-12 text-center">

                            <div class="row">

                                <div class="col-md-12">

                                    <div class="panel panel-default">

                                        <div class="panel-heading">

                                            <button type="button" class="btn-close float-end" data-bs-dismiss="modal">

                                                <span>&times;</span>

                                            </button>

                                            <input type="hidden" id="idEspacio">

                                            <h3 class="text-uppercase">
                                                Guardar Espacio
                                            </h3>

                                            <p>

                                                <b>Crear o editar un espacio.</b>

                                            </p>

                                        </div>

                                        <div class="panel-body panel-block">

                                            <div class="panel panel-default">

                                                <div id="formGuardarEspacio" style="justify-items:end; marin-top:5px;"
                                                    class="pt-5">

                                                </div>

                                            </div>

                                            <div class="text-right" style="margin-bottom:2%;">

                                                <button type="button" class="btn btn-success" id="accionar">

                                                    Guardar

                                                </button>

                                                <button type="button" class="btn btn-outline-secondary"
                                                    data-bs-dismiss="modal">

                                                    Cerrar

                                                </button>

                                            </div>

                                        </div>

                                    </div>

                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

        </div>

    </div>

    <div class="modal fade" id="configAtributos" role="dialog">

        <div class="modal-dialog modal-lg">

            <div class="modal-content">

                <div class="panel-heading">
                    <button type="button" class="btn-close float-end" data-bs-dismiss="modal" aria-label="Cerrar"></button>
                    <h4>

                        Configurar atributos

                    </h4>

                    
                </div>

                <div class="modal-body">

                    <div id="formConfigurarAtributos">

                    </div>


                </div>

                <div class="modal-footer">

                    <button class="btn btn-success" id="guardarConfiguracion">

                        Guardar

                    </button>

                    <button class="btn btn-outline-secondary" data-bs-dismiss="modal">

                        Cerrar

                    </button>

                </div>

            </div>

        </div>

    </div>

    <script src="https://code.jquery.com/jquery-3.7.1.min.js"></script>

    <script src="https://cdn.datatables.net/1.13.8/js/jquery.dataTables.min.js"></script>
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js"></script>
    <script src="{{ asset('js/bootstrap5-modal.js') }}"></script>

    <script src="{{asset('js/bootstrap-datetimepicker.min.js')}}"></script>

    <script src="{{asset('js/bootstrap-datetimepicker.es.js')}}"></script>

    <script src="{{asset('js/espacios.js')}}"></script> 

</html>
