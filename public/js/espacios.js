let markedId = 0;
let tablaEspacios = null;

let zonas = [];
let tiposEspacios = [];
let estadosEspacios = [];

let espacioSeleccionado = null;


$('#guardarConfiguracion').on('click', guardarConfiguracion);

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



                    button += '<li class="btn-info">';

                    button += '<button class="btn btn-link" style="color:white;" onclick="configurarEspacio(' + row.id + ')">';

                    button += '<i class="fa fa-cog" aria-hidden="true"></i> Configurar';

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



async function configurarEspacio(id) {

    espacioSeleccionado = id;



    const form = document.getElementById('formConfigurarAtributos');
    form.innerHTML = `

    <div class="row">

        <div class="form-group col-md-12">

            <label class="obligatorio">

                Tipo de atributo

            </label>

            <select class="form-control" id="tipoAtributo">

                <option value="">Seleccione...</option>

                <option value="precio">Vr_Precio</option>

                <option value="horario">Horarios</option>

                <option value="otro">Otro</option>

            </select>

        </div>

    </div>

    <div id="contenidoAtributo"></div>

`;



    $('#tipoAtributo').on('change', mostrarFormularioAtributo);

    $('#configAtributos').modal('show');
}

function mostrarFormularioAtributo() {

    let tipo = $('#tipoAtributo').val();

    let html = '';

    if (tipo == 'precio') {

        html = `

            <div class="form-group">

                <label class="obligatorio">

                    Valor

                </label>

                <input
                    type="number"
                    id="valorPrecio"
                    class="form-control"
                    placeholder="Ej: 5000">

            </div>

        `;

    }

    else if (tipo == 'horario') {

        const dias = [
            { key: 'monday', nombre: 'Lunes' },
            { key: 'tuesday', nombre: 'Martes' },
            { key: 'wednesday', nombre: 'Miércoles' },
            { key: 'thursday', nombre: 'Jueves' },
            { key: 'friday', nombre: 'Viernes' },
            { key: 'saturday', nombre: 'Sábado' },
            { key: 'sunday', nombre: 'Domingo' }
        ];

        html = '';

        dias.forEach(function (dia) {

            html += `

            <div class="panel panel-default">

                <div class="panel-heading">

                    <label style="margin-bottom:0;">

                        <input
                            type="checkbox"
                            class="diaHabilitado"
                            data-day="${dia.key}">

                        <strong>${dia.nombre}</strong>

                    </label>

                </div>

                <div class="panel-body">

                    <div
                        id="horarios_${dia.key}"
                        class="contenedorHorarios">

                    </div>

                </div>

            </div>

        `;

        });

    }

    else if (tipo == 'otro') {

        html = `

            <div class="form-group">

                <label class="obligatorio">

                    Nombre

                </label>

                <input
                    type="text"
                    id="nombreOtro"
                    class="form-control"
                    placeholder="Ej: Video Beam">

            </div>

            <div class="form-group">

                <label class="obligatorio">

                    Valor

                </label>

                <input
                    type="text"
                    id="valorOtro"
                    class="form-control"
                    placeholder="Ej: Sí">

            </div>

        `;

    }

    $('#contenidoAtributo').html(html);

}




function guardarConfiguracion() {
    console.log("Hola boton")
    if ($('#atributo').val() == '') {

        Lobibox.notify('error', {
            title: 'Debe seleccionar un atributo.',
            showClass: 'fadeInDown',
            hideClass: 'fadeUpDown',
            delay: 5000,
            sound: false,
            icon: false,
            width: 400
        });

        return;

    }

    $.ajax({

        type: 'POST',

        url: '/atributosEspacios',

        data: {

            espacio_id: espacioSeleccionado,

            atributo_id: $('#atributo').val()

        },

        success: function (response) {

            Lobibox.notify('success', {
                title: response.message,
                showClass: 'fadeInDown',
                hideClass: 'fadeUpDown',
                delay: 5000,
                sound: false,
                icon: false,
                width: 400
            });

            $('#configAtributos').modal('hide');

        },

        error: function (response) {

            Lobibox.notify('error', {
                title: response.responseJSON.message,
                showClass: 'fadeInDown',
                hideClass: 'fadeUpDown',
                delay: 5000,
                sound: false,
                icon: false,
                width: 400
            });

        }

    });

}


$(document).on('change', '.diaHabilitado', function () {

    const dia = $(this).data('day');

    if ($(this).is(':checked')) {

        agregarBloqueHorario(dia);

    } else {

        $('#horarios_' + dia).empty();

    }

});

function agregarBloqueHorario(dia) {

    let html = `

        <div class="row bloqueHorario" style="margin-bottom:10px;">

            <div class="col-md-5">

                <input
                    type="time"
                    class="form-control horaDesde">

            </div>

            <div class="col-md-5">

                <input
                    type="time"
                    class="form-control horaHasta">

            </div>

            <div class="col-md-2">

                <button
                    type="button"
                    class="btn btn-danger eliminarHorario">

                    <i class="fa fa-trash"></i>

                </button>

            </div>

        </div>

        <div class="text-right">

            <button
                type="button"
                class="btn btn-success btn-xs agregarHorario"
                data-day="${dia}">

                <i class="fa fa-plus"></i> Agregar horario

            </button>

        </div>

    `;

    $('#horarios_' + dia).html(html);

}