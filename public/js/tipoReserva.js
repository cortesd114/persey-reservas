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
            url: '/tipoReserva/@',
            dataSrc: 'data'
        },
        initComplete: function () {

            $('#tabla thead th').eq(2).css('text-align', 'center');

            $('#tabla thead th').eq(3).css('text-align', 'center');

        },
        columns: [
            {
                data: null,
                render(data, type, row, meta) {
                    return meta.row + 1;
                }
            },

            { data: 'nombre', className: 'text-left' },

            {
                data: 'color',
                className: 'text-center',
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
                className: 'text-center',
                render: function (_, _, row) {

                    let button = '<center>';

                    button += '<div class="btn-group btn-group-default">';

                    button += '<button class="btn btn-outline-secondary" type="button">';
                    button += '<i class="fa fa-bars" aria-hidden="true"></i>';
                    button += '</button>';

                    button += '<button data-bs-toggle="dropdown" class="btn btn-outline-secondary dropdown-toggle" type="button">';
                    button += '<span class="caret"></span>';
                    button += '</button>';

                    button += '<ul class="dropdown-menu" style="margin-left:-70px;">';

                    button += '<li><button class="dropdown-item text-dark bg-warning" onclick="editItem(' + row.id + ')">';
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

    showModal('config');

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

            hideModal('config');

            tablaTipoReserva.ajax.reload();

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
        Lobibox.notify('error', {
            title: 'No se pudo aplicar los cambios',
            msg: messages.join('<br>'),
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


function editItem(id) {

    markedId = id;

    $.ajax({
        type: 'GET',
        url: '/tipoReserva/' + id,

        success: function (response) {

            showTipoReserva(response.data);

            showModal('config');

        },

        error: function (response) {

            console.log(response);

            Lobibox.notify('error', {
                title: response.message,
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

                <div class="form-group col-md-4 text-center">
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
