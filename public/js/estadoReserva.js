let markedId = 0;
let tablaEstadoReserva = null;

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

    tablaEstadoReserva = $('#tabla').DataTable({

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
            url: '/estadoReserva/@',
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
                data: null,
                render: function (data) {

                    return data.ocupado == 1 ? 'SI' : 'NO';

                }
            },

            {
                data: null,
                orderable: false,
                className: 'text-center',

                render: function (_, _, row) {

                    let button = '<center>';

                    button += '<div class="btn-group btn-group-default">';

                    button += '<button class="btn btn-outline-secondary" type="button">';
                    button += '<i class="fa fa-bars"></i>';
                    button += '</button>';

                    button += '<button class="btn btn-outline-secondary dropdown-toggle" data-bs-toggle="dropdown">';
                    button += '<span class="caret"></span>';
                    button += '</button>';

                    button += '<ul class="dropdown-menu" style="margin-left:-70px;">';

                    button += '<li><button class="dropdown-item text-dark bg-warning" onclick="editItem(' + row.id + ')">';
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

function createItem() {

    markedId = null;

    const form = document.getElementById('formGuardarEstadoReserva');

    form.innerHTML = '';

    form.innerHTML = `

        <div class="col-12 col-md-12">

            <div class="row">

                <div class="form-group col-md-8">

                    <label class="obligatorio">
                        Nombre
                    </label>

                    <input
                        type="text"
                        class="form-control text-center"
                        id="estadoReserva">

                </div>

                <div class="form-group col-md-4">

                    <label>
                        Ocupado
                    </label>

                    <div>

                        <label class="switch">

                            <input id="ocupado" type="checkbox">

                            <span class="slider round"></span>

                        </label>

                    </div>

                </div>

            </div>

        </div>

    `;

    $('#ocupado').prop('checked', false);

    $('#accionar').prop('disabled', false);

    showModal('config');

}

function isValid() {

    const nombre = $('#estadoReserva').val();

    let valid = true;

    let mensajes = [];

    if (!nombre) {

        valid = false;

        mensajes.push('El nombre es obligatorio.');

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

        url: '/estadoReserva',

        data: {

            id: markedId,

            nombre: $('#estadoReserva').val(),

            ocupado: $('#ocupado').is(':checked') ? 1 : 0

        },

        success: function (response) {

            hideModal('config');

            tablaEstadoReserva.ajax.reload();

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

function editItem(id) {

    markedId = id;

    $.ajax({

        type: 'GET',

        url: '/estadoReserva/' + id,

        success: function (response) {

            showEstadoReserva(response.data);

            showModal('config');

        },

        error: function () {

            Lobibox.notify('error', {

                title: 'No fue posible consultar la información.',

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

function showEstadoReserva(estado) {

    const form = document.getElementById('formGuardarEstadoReserva');

    form.innerHTML = `

        <div class="col-12 col-md-12">

            <div class="row">

                <div class="form-group col-md-8">

                    <label class="obligatorio">

                        Nombre

                    </label>

                    <input
                        type="text"
                        class="form-control text-center"
                        id="estadoReserva">

                </div>

                <div class="form-group col-md-4">

                    <label>

                        Ocupado

                    </label>

                    <div>

                        <label class="switch">

                            <input id="ocupado" type="checkbox">

                            <span class="slider round"></span>

                        </label>

                    </div>

                </div>

            </div>

        </div>

    `;

    $('#estadoReserva').val(estado.nombre);

    $('#ocupado').prop('checked', estado.ocupado == 1);

    $('#accionar').prop('disabled', false);

}
