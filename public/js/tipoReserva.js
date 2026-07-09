let markedId = 0;
let tablaTipoReserva = null;

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

    tablaTipoReserva = $('#tabla').DataTable({

        processing: true,
        destroy: true,

        ajax: {
            url: '/tipoReserva/@',
            dataSrc: 'data'
        },

        columns: [

            { data: 'id' },

            { data: 'nombre' },

            {
                data: 'color',
                render: function (data) {

                    return `
                        <div style="
                            width:25px;
                            height:25px;
                            background:${data};
                            border-radius:50%;
                            margin:auto;
                            border:1px solid #999;">
                        </div>
                    `;

                }
            },

            {
                data: null,
                orderable: false,
                render: function (_, _, row) {

                    let button = '<center>';

                    button += '<div class="btn-group btn-group-default">';

                    button += '<button class="btn btn-default" type="button">';
                    button += '<i class="fa fa-bars" aria-hidden="true"></i>';
                    button += '</button>';

                    button += '<button data-toggle="dropdown" class="btn btn-default dropdown-toggle" type="button">';
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

    const form = document.getElementById('formGuardarTipoReserva');

    form.innerHTML = '';

    form.innerHTML = `
        <div class="col-12 col-md-12">

            <div class="row">

                <div class="form-group col-md-8">

                    <label class="obligatorio text-left">
                        Nombre
                    </label>

                    <input
                        type="text"
                        class="form-control text-center"
                        id="tipoReservaNombre"
                        placeholder="Ej: Sala de juntas">

                </div>

                <div class="form-group col-md-4">

                    <label class="obligatorio">
                        Color
                    </label>

                    <input
                        type="color"
                        class="form-control"
                        id="tipoReservaColor"
                        value="#2196F3">

                </div>

            </div>

        </div>
    `;

    $('#accionar').prop('disabled', false);

    $('#config').modal('show');

}

function save() {

    $('#accionar').prop('disabled', true);

    $.ajax({

        type: 'POST',

        url: '/tipoReserva',

        data: {

            id: markedId,

            nombre: $('#tipoReservaNombre').val(),

            color: $('#tipoReservaColor').val()

        },

        success: function (response) {

            $('#config').modal('hide');

            tablaTipoReserva.ajax.reload();

            alert(response.message);

        },

        error: function (response) {

            $('#accionar').prop('disabled', false);

            alert('Error al guardar');

        }

    });

}

function isValid() {

    const nombre = $('#tipoReservaNombre').val();
    const color = $('#tipoReservaColor').val();

    let valid = true;

    let mensajes = [];

    if (!nombre) {

        valid = false;

        mensajes.push('El nombre es obligatorio.');

    }

    if (!color) {

        valid = false;

        mensajes.push('Debe seleccionar un color.');

    }

    if (!valid) {

        alert(mensajes.join('\n'));

    }

    return valid;

}

function handleButtonSave() {

    if (!isValid()) {

        return;

    }

    save();

}


function editItem(id) {

    markedId = id;

    $.ajax({
        type: 'GET',
        url: '/tipoReserva/' + id,

        success: function (response) {

            showTipoReserva(response.data);

            $('#config').modal('show');

        },

        error: function (response) {

            console.log(response);

            alert('Error al consultar.');

        }

    });

}

function showTipoReserva(tipo) {

    const form = document.getElementById('formGuardarTipoReserva');

    form.innerHTML = `
        <div class="col-12 col-md-12">
            <div class="row">

                <div class="form-group col-md-8">
                    <label class="obligatorio">Nombre</label>
                    <input
                        type="text"
                        class="form-control text-center"
                        id="tipoReservaNombre">
                </div>

                <div class="form-group col-md-4">
                    <label class="obligatorio">Color</label>
                    <input
                        type="color"
                        class="form-control"
                        id="tipoReservaColor">
                </div>

            </div>
        </div>
    `;

    $('#tipoReservaNombre').val(tipo.nombre);
    $('#tipoReservaColor').val(tipo.color);

    $('#accionar').prop('disabled', false);

}