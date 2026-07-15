<!DOCTYPE html>
<html lang="es">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta name="csrf-token" content="{{ csrf_token() }}">

    <title>Estados de Reserva</title>

    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css">
    <link rel="stylesheet" href="{{ asset('css/bootstrap5-compat.css') }}?v=5">
    <link rel="stylesheet" href="https://cdn.datatables.net/1.13.8/css/jquery.dataTables.min.css">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css">

    <style>

        .obligatorio::after{
            content: " *";
            color:red;
        }

        .switch {
            position: relative;
            display: inline-block;
            width: 60px;
            height: 34px;
        }

        .switch input{
            opacity:0;
            width:0;
            height:0;
        }

        .slider{
            position:absolute;
            cursor:pointer;
            top:0;
            left:0;
            right:0;
            bottom:0;
            background:#ccc;
            transition:.4s;
        }

        .slider:before{
            position:absolute;
            content:"";
            height:26px;
            width:26px;
            left:4px;
            bottom:4px;
            background:white;
            transition:.4s;
        }

        input:checked + .slider{
            background:#2196F3;
        }

        input:checked + .slider:before{
            transform:translateX(26px);
        }

        .slider.round{
            border-radius:34px;
        }

        .slider.round:before{
            border-radius:50%;
        }

        .swal-text{
            text-align:center;
        }

    </style>

</head>

<body>

<div class="container" style="width:99%;">

    <div class="row">

        <div class="col-md-12 text-center" style="margin-top:2%;">

            <div class="row">

                <div class="col-md-12">

                    <div class="panel panel-default">

                        <div class="panel-heading">

                            <h3 class="text-uppercase">
                                Estados de Reserva
                            </h3>

                            <p>
                                <b>Crear y modificar los estados de reserva.</b>
                            </p>

                            <div class="text-end">
                                <button
                                    type="button"
                                    id="nuevoRegistro"
                                    class="btn btn-success"
                                    style="padding:9px;">Nuevo

                                </button>
                            </div>

                        </div>

                        <div class="panel-body panel-block">

                            <table
                                id="tabla"
                                class="table table-striped table-bordered dt-responsive text-center">

                                <thead>

                                    <tr>

                                        <th style="width:5%;">
                                            It
                                        </th>

                                        <th style="width:35%;text-align:left;">
                                            Nombre
                                        </th>

                                        <th style="width:15%;">
                                            Ocupado
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

<div class="modal fade bd-example-modal-lg" id="config" role="dialog">

    <div class="modal-dialog modal-lg">

        <section class="modal-content">

            <div class="container" style="width:99%;">

                <div class="row">

                    <div class="col-md-12 text-center">

                        <div class="row">

                            <div class="col-md-12">

                                <div class="panel panel-default">

                                    <div class="panel-heading">

                                        <button
                                            type="button"
                                            class="btn-close float-end"
                                            data-bs-dismiss="modal">

                                            <span>&times;</span>

                                        </button>

                                        <input
                                            type="hidden"
                                            id="idEstadoReserva">

                                        <h3 class="text-uppercase">

                                            Guardar Estado de Reserva

                                        </h3>

                                        <p>

                                            <b>Crear o editar un estado.</b>

                                        </p>

                                    </div>

                                    <div class="panel-body panel-block">

                                        <div class="panel panel-default">

                                            <div
                                                id="formGuardarEstadoReserva"
                                                style="justify-items:end;">

                                            </div>

                                        </div>

                                        <div
                                            class="text-right"
                                            style="margin-bottom:2%;">

                                            <button
                                                type="button"
                                                class="btn btn-success"
                                                id="accionar">

                                                Guardar

                                            </button>

                                            <button
                                                type="button"
                                                class="btn btn-outline-secondary"
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

<script src="https://code.jquery.com/jquery-3.7.1.min.js"></script>

<script src="https://cdn.datatables.net/1.13.8/js/jquery.dataTables.min.js"></script>

<script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js"></script>
<script src="{{ asset('js/bootstrap5-modal.js') }}"></script>

<script src="{{ asset('js/estadoReserva.js') }}"></script>

</body>

</html>
