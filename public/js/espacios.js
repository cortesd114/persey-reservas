let markedId = 0;
let tablaEspacios = null;

let zonas = [];
let tiposEspacios = [];
let estadosEspacios = [];

$.ajaxSetup({
    headers: {
        'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
    }
});

$(document).ready(function () {

    cargarTabla();

    $('#nuevoRegistro').on('click', createItem);

    $('#accionar').on('click', handleButtonSave);

});

function cargarTabla() {

    tablaEspacios = $('#tabla').DataTable({

        processing: true,
        destroy: true,

        language: {
            decimal: "",
            emptyTable: "No hay datos disponibles",
            info: "Mostrando _START_ a _END_ de _TOTAL_ registros",
            infoEmpty: "Mostrando 0 a 0 de 0 registros",
            infoFiltered: "(filtrado de _MAX_ registros)",
            lengthMenu: "Mostrar _MENU_ registros",
            loadingRecords: "Cargando...",
            processing: "Procesando...",
            search: "Buscar:",
            zeroRecords: "No se encontraron resultados",
            paginate: {
                first: "Primero",
                last: "Último",
                next: "Siguiente",
                previous: "Anterior"
            }
        },

        ajax: {
            url: '/espacios/@',
            dataSrc: 'data'
        },

        columns: [

            {
                data: null,
                render: function (data, type, row, meta) {
                    return meta.row + 1;
                }
            },

            {
                data: 'nombre',
                className: 'text-left'
            },

            {
                data: 'zona.nombre',
                className: 'text-left'
            },

            {
                data: 'tipo_espacio.nombre',
                className: 'text-left'
            },

            {
                data: 'estado_espacio.nombre',
                className: 'text-left'
            },

            {
                data: null,
                orderable: false,
                className: 'text-center',

                render: function (_, _, row) {

                    let button = '<center>';

                    button += '<div class="btn-group btn-group-default">';

                    button += '<button class="btn btn-default" type="button">';
                    button += '<i class="fa fa-bars"></i>';
                    button += '</button>';

                    button += '<button class="btn btn-default dropdown-toggle" data-toggle="dropdown" type="button">';
                    button += '<span class="caret"></span>';
                    button += '</button>';

                    button += '<ul class="dropdown-menu" style="margin-left:-70px;">';

                    button += '<li class="btn-warning">';

                    button += '<button class="btn btn-link" style="color:white;" onclick="editItem(' + row.id + ')">';

                    button += '<i class="fa fa-pencil-square-o"></i> Editar';

                    button += '</button>';

                    button += '</li>';

                    button += '</ul>';

                    button += '</div>';

                    button += '</center>';

                    return button;

                }

            }

        ]

    });

}


async function cargarCatalogos() {

    const responseZonas = await $.get('/zonas/@');
    zonas = responseZonas.data;

    const responseTipos = await $.get('/tipoEspacios/@');
    tiposEspacios = responseTipos.data;

    const responseEstados = await $.get('/estadoEspacios/@');
    estadosEspacios = responseEstados.data;

}

function llenarSelect(id, datos) {

    const select = $('#' + id);

    select.empty();

    select.append('<option value="">Seleccione...</option>');

    datos.forEach(function (item) {

        select.append(
            `<option value="${item.id}">
                ${item.nombre}
            </option>`
        );

    });

}

async function createItem() {

    markedId = null;

    await cargarCatalogos();

    const form = document.getElementById('formGuardarEspacio');

    form.innerHTML = `

        <div class="col-md-12 ">

            <div class="row ">

                <div class="form-group col-md-6 mt-6">

                    <label class="obligatorio">
                        Nombre
                    </label>

                    <input
                        type="text"
                        class="form-control"
                        id="nombre"
                        placeholder="Ej: Aula 201">

                </div>

                <div class="form-group col-md-6">

                    <label class="obligatorio">
                        Zona
                    </label>

                    <select
                        class="form-control"
                        id="zona">

                    </select>

                </div>

            </div>

            <div class="row">

                <div class="form-group col-md-6">

                    <label class="obligatorio">
                        Tipo de espacio
                    </label>

                    <select
                        class="form-control"
                        id="tipoEspacio">

                    </select>

                </div>

                <div class="form-group col-md-6">

                    <label class="obligatorio">
                        Estado
                    </label>

                    <select
                        class="form-control"
                        id="estadoEspacio">

                    </select>

                </div>

            </div>

        </div>

    `;

    llenarSelect('zona', zonas);

    llenarSelect('tipoEspacio', tiposEspacios);

    llenarSelect('estadoEspacio', estadosEspacios);

    $('#accionar').prop('disabled', false);

    $('#config').modal('show');

}

function isValid() {

    const nombre = $('#nombre').val();
    const zona = $('#zona').val();
    const tipoEspacio = $('#tipoEspacio').val();
    const estadoEspacio = $('#estadoEspacio').val();

    let valid = true;

    let mensajes = [];

    if (!nombre) {
        valid = false;
        mensajes.push('El nombre es obligatorio.');
    }

    if (!zona) {
        valid = false;
        mensajes.push('Debe seleccionar una zona.');
    }

    if (!tipoEspacio) {
        valid = false;
        mensajes.push('Debe seleccionar un tipo de espacio.');
    }

    if (!estadoEspacio) {
        valid = false;
        mensajes.push('Debe seleccionar un estado.');
    }

    if (!valid) {

        Lobibox.notify('error', {
            title: 'No se pudo aplicar los cambios',
            msg: mensajes.join('<br>'),
            showClass: 'fadeInDown',
            hideClass: 'fadeUpDown',
            delay: 15000,
            sound: false,
            icon: false,
            width: 400
        });

    }

    return valid;

}

function handleButtonSave() {

    if (!isValid()) {
        return;
    }

    save();

}

function save() {

    $('#accionar').prop('disabled', true);

    $.ajax({

        type: 'POST',

        url: '/espacios',

        data: {

            id: markedId,

            nombre: $('#nombre').val(),

            zona_id: $('#zona').val(),

            tipo_espacio_id: $('#tipoEspacio').val(),

            estado_espacio_id: $('#estadoEspacio').val()

        },

        success: function (response) {

            $('#config').modal('hide');

            tablaEspacios.ajax.reload();

            Lobibox.notify('success', {
                title: response.message,
                showClass: 'fadeInDown',
                hideClass: 'fadeUpDown',
                delay: 15000,
                sound: false,
                icon: false,
                width: 400
            });

        },

        error: function (response) {

            $('#accionar').prop('disabled', false);

            Lobibox.notify('error', {
                title: 'Error',
                msg: response.responseJSON?.message ?? 'Ocurrió un error.',
                showClass: 'fadeInDown',
                hideClass: 'fadeUpDown',
                delay: 15000,
                sound: false,
                icon: false,
                width: 400
            });

        }

    });

}

async function editItem(id) {

    markedId = id;

    await cargarCatalogos();

    $.ajax({

        type: 'GET',

        url: '/espacios/' + id,

        success: function (response) {

            showEspacio(response.data);

            $('#config').modal('show');

        },

        error: function (response) {

            Lobibox.notify('error', {
                title: 'Error',
                msg: response.responseJSON?.message ?? 'No fue posible consultar la información.',
                showClass: 'fadeInDown',
                hideClass: 'fadeUpDown',
                delay: 15000,
                sound: false,
                icon: false,
                width: 400
            });

        }

    });

}

function showEspacio(espacio) {

    const form = document.getElementById('formGuardarEspacio');

    form.innerHTML = `

        <div class="col-md-12">

            <div class="row">

                <div class="form-group col-md-6">

                    <label class="obligatorio">
                        Nombre
                    </label>

                    <input
                        type="text"
                        class="form-control"
                        id="nombre">

                </div>

                <div class="form-group col-md-6">

                    <label class="obligatorio">
                        Zona
                    </label>

                    <select
                        class="form-control"
                        id="zona">

                    </select>

                </div>

            </div>

            <div class="row">

                <div class="form-group col-md-6">

                    <label class="obligatorio">
                        Tipo de espacio
                    </label>

                    <select
                        class="form-control"
                        id="tipoEspacio">

                    </select>

                </div>

                <div class="form-group col-md-6">

                    <label class="obligatorio">
                        Estado
                    </label>

                    <select
                        class="form-control"
                        id="estadoEspacio">

                    </select>

                </div>

            </div>

        </div>

    `;

    llenarSelect('zona', zonas);

    llenarSelect('tipoEspacio', tiposEspacios);

    llenarSelect('estadoEspacio', estadosEspacios);

    $('#nombre').val(espacio.nombre);

    $('#zona').val(espacio.zona_id);

    $('#tipoEspacio').val(espacio.tipo_espacio_id);

    $('#estadoEspacio').val(espacio.estado_espacio_id);

    $('#accionar').prop('disabled', false);

}