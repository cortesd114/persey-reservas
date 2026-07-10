let markedId = 0;
let tablaTipoEspacios = null;

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

    tablaTipoEspacios = $('#tabla').DataTable({

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
            url: '/tipoEspacios/@',
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
                orderable: false,
                className: 'text-center',

                render: function (_, _, row) {

                    let button = '<center>';

                    button += '<div class="btn-group btn-group-default">';

                    button += '<button class="btn btn-default" type="button">';
                    button += '<i class="fa fa-bars" aria-hidden="true"></i>';
                    button += '</button>';

                    button += '<button class="btn btn-default dropdown-toggle" data-toggle="dropdown" type="button">';
                    button += '<span class="caret"></span>';
                    button += '</button>';

                    button += '<ul class="dropdown-menu" style="margin-left:-70px;">';

                    button += '<li class="btn-warning">';
                    button += '<button class="btn btn-link" style="color:white;" onclick="editItem(' + row.id + ')">';
                    button += '<i class="fa fa-pencil-square-o" aria-hidden="true"></i> Editar';
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

    const form = document.getElementById('formGuardarTipoEspacios');

    form.innerHTML = '';

    form.innerHTML = `

        <div class="col-12 col-md-12">

            <div class="row">

                <div class="form-group col-md-12">

                    <label class="obligatorio">
                        Nombre
                    </label>

                    <input
                        type="text"
                        class="form-control text-center"
                        id="tipoEspacio"
                        placeholder="Ej: Aula">

                </div>

            </div>

        </div>

    `;

    $('#accionar').prop('disabled', false);

    $('#config').modal('show');

}

function isValid() {

    const nombre = $('#tipoEspacio').val();

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

        url: '/tipoEspacios',

        data: {

            id: markedId,

            nombre: $('#tipoEspacio').val()

        },

        success: function (response) {

            $('#config').modal('hide');

            tablaTipoEspacios.ajax.reload();

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

        url: '/tipoEspacios/' + id,

        success: function (response) {

            showTipoEspacios(response.data);

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

function showTipoEspacios(tipoEspacio) {

    const form = document.getElementById('formGuardarTipoEspacios');

    form.innerHTML = `

        <div class="col-12 col-md-12">

            <div class="row">

                <div class="form-group col-md-12">

                    <label class="obligatorio">
                        Nombre
                    </label>

                    <input
                        type="text"
                        class="form-control text-center"
                        id="tipoEspacio">

                </div>

            </div>

        </div>

    `;

    $('#tipoEspacio').val(tipoEspacio.nombre);

    $('#accionar').prop('disabled', false);

}