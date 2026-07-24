let markedId = 0;
let tablaEspacios = null;

let zonas = [];
let tiposEspacios = [];
let estadosEspacios = [];
let atributosConfigurados = [];
let horariosConfigurados = null;
let otrosConfigurados = [];
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
                    button += '<button class="btn btn-outline-secondary" type="button">';
                    button += '<i class="fa fa-bars"></i>';
                    button += '</button>';
                    button += '<button class="btn btn-outline-secondary dropdown-toggle" data-bs-toggle="dropdown" type="button">';
                    button += '<span class="caret"></span>';
                    button += '</button>';
                    button += '<ul class="dropdown-menu" style="margin-left:-70px;">';
                    button += '<li><button class="dropdown-item text-dark bg-warning" onclick="editItem(' + row.id + ')">';
                    button += '<i class="fa fa-pencil-square-o"></i> Editar';
                    button += '</button>';
                    button += '</li>';
                    button += '<li><button class="dropdown-item text-white bg-info" onclick="configurarEspacio(' + row.id + ')">';
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

    showModal('config');

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

            hideModal('config');

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

            showModal('config');

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

    contadorHorarios = 0;

    await consultarAtributos();

    const form = document.getElementById(
        'formConfigurarAtributos'
    );


    form.innerHTML = `

        <div class="row">

            <div class="form-group col-md-12">

                <label class="obligatorio">

                    Tipo de atributo

                </label>

                <select
                    class="form-control"
                    id="tipoAtributo">

                    <option value="">
                        Seleccione...
                    </option>

                    <option value="precio">
                        Vr_Precio
                    </option>

                    <option value="horario">
                        Horarios
                    </option>

                    <option value="direccion">
                        Direccion
                    </option>
<!--
                    <option value="otro">
                        Otro
                    </option> -->

                </select>

            </div>

        </div>

        <div id="contenidoAtributo"></div>

    `;


    $('#tipoAtributo').on(
        'change',
        mostrarFormularioAtributo
    );


    showModal('configAtributos');

}

function mostrarFormularioAtributo() {

    let tipo = $('#tipoAtributo').val();



    let html = '';


    if (tipo == 'precio') {

        let precio = obtenerAtributo('Vr_Precio');

        let valorPrecio = '';
        if (precio) {

            valorPrecio = precio.valor;

        }

        html = `

            <div class="form-group">

                <label class="obligatorio">

                    Valor

                </label>

             <input
                type="number"
                id="valorPrecio"
                class="form-control"
                value="${valorPrecio}"
                placeholder="Ej: 5000">

            </div>

        `;

    }
    else if (tipo == 'direccion') {
        let direccion = obtenerAtributo('Direccion');
        let valorDireccion = '';

        if (direccion) {
            valorDireccion = direccion.valor;
        }
        html = `

            <div class="form-group">

                <label class="obligatorio">

                    Valor

                </label>

             <input
                type="text"
                id="valorDireccion"
                class="form-control"
                value="${valorDireccion}"
                placeholder="Ej: lote 4 ">

            </div>

        `;
    }

    else if (tipo == 'horario') {

        let horarios = obtenerAtributo('Horarios');

        let valorHorarios = null;
        if (horarios) {

            valorHorarios = JSON.parse(horarios.valor);

            horariosConfigurados = valorHorarios;

        }
        else {

            horariosConfigurados = null;

        }



        html = `

        <div id="editorHorarios">

        </div>

    `;

    }
    else if (tipo == 'otro') {

        otrosConfigurados = [];

        atributosConfigurados.forEach(function (atributo) {

            if (
                atributo.nombre != 'Vr_Precio' &&
                atributo.nombre != 'Horarios'
            ) {

                otrosConfigurados.push({

                    nombre: atributo.nombre,
                    valor: atributo.valor

                });

            }

        });

        html = `

        <div class="row">

            <div class="col-md-5">

                <label class="obligatorio">

                    Nombre

                </label>

                <input
                    type="text"
                    id="nombreOtro"
                    class="form-control"
                    placeholder="Ej: Video Beam">

            </div>

            <div class="col-md-5">

                <label class="obligatorio">

                    Valor

                </label>

                <input
                    type="text"
                    id="valorOtro"
                    class="form-control"
                    placeholder="Ej: Sí">

            </div>

            <div class="col-md-2">

                <label>

                    &nbsp;

                </label>

                <button
                    type="button"
                    class="btn btn-success"
                    id="agregarOtro">

                    +

                </button>

            </div>

        </div>

        <br>

        <div id="listaOtros">

        </div>

    `;

    }

    $('#contenidoAtributo').html(html);

    if (tipo == 'horario') {

        construirEditorHorarios();

    }

    if (tipo == 'otro') {

        pintarOtros();

    }
}

function construirEditorHorarios() {


    const dias = [

        { key: 'monday', nombre: 'Lunes' },

        { key: 'tuesday', nombre: 'Martes' },

        { key: 'wednesday', nombre: 'Miércoles' },

        { key: 'thursday', nombre: 'Jueves' },

        { key: 'friday', nombre: 'Viernes' },

        { key: 'saturday', nombre: 'Sábado' },

        { key: 'sunday', nombre: 'Domingo' }

    ];


    let html = '';

    dias.forEach(function (dia) {



        if (horariosConfigurados?.[dia.key]) {



        }


        html += `

            <div class="panel panel-default">

                <div class="panel-heading">

                    <label style="margin-bottom:0">

                        <input
                            type="checkbox"
                            class="habilitarDia"
                            data-dia="${dia.key}">

                        <strong>${dia.nombre}</strong>

                    </label>

                </div>

                <div class="panel-body">

                    <div
                        id="contenedor_${dia.key}">
                    </div>

                </div>

            </div>

        `;

    });

    $('#editorHorarios').html(html);
    dias.forEach(function (dia) {

        if (!horariosConfigurados?.[dia.key]) {

            return;

        }

        if (!horariosConfigurados[dia.key][0].enabled) {

            return;

        }

        let horarios = horariosConfigurados[dia.key];
        $('.habilitarDia[data-dia="' + dia.key + '"]')
            .prop('checked', true);

        agregarPrimerHorario(dia.key);

        $('#horarios_' + dia.key + ' .horaDesde')
            .first()
            .val(horarios[0].from);

        $('#horarios_' + dia.key + ' .horaHasta')
            .first()
            .val(horarios[0].to);

        for (let i = 1; i < horarios.length; i++) {

            agregarHorario(dia.key);

            $('#horarios_' + dia.key + ' .horaDesde')
                .last()
                .val(horarios[i].from);

            $('#horarios_' + dia.key + ' .horaHasta')
                .last()
                .val(horarios[i].to);

        }
    });

}



function guardarConfiguracion() {

    const tipo = $('#tipoAtributo').val();

    let nombre = '';
    let valor = '';
    let required = 0;


    if (tipo == '') {

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

    if (tipo == 'horario') {

        const horarios = construirJSONHorarios();
        console.log(

            $('.habilitarDia[data-dia="friday"]')
                .is(':checked')

        );

        if (!validarHorarios(horarios)) {

            return;

        }

        if (!validarCruceHorarios(horarios)) {

            return;

        }


        nombre = 'Horarios';

        valor = JSON.stringify(horarios);

        required = 1;

    }


    //PRECIO
    else if (tipo == 'precio') {

        if ($('#valorPrecio').val() == '') {

            Lobibox.notify('error', {
                title: 'Debe ingresar el valor del precio.',
                showClass: 'fadeInDown',
                hideClass: 'fadeUpDown',
                delay: 5000,
                sound: false,
                icon: false,
                width: 400
            });

            return;

        }


        nombre = 'Vr_Precio';

        valor = $('#valorPrecio').val();

        required = 1;

    }
    //direccion
     else if (tipo == 'Direccion') {

        if ($('#valorDireccion').val() == '') {

            Lobibox.notify('error', {
                title: 'Debe ingresar una direccion.',
                showClass: 'fadeInDown',
                hideClass: 'fadeUpDown',
                delay: 5000,
                sound: false,
                icon: false,
                width: 400
            });

            return;

        }


        nombre = 'Direccion ';

        valor = $('#valorDireccion').val();

        required = 1;

    }

    
    //OTROS
    else if (tipo == 'otro') {

        if (otrosConfigurados.length == 0) {

            Lobibox.notify('error', {
                title: 'Debe agregar al menos un atributo.',
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

            type: 'DELETE',

            url: '/atributosEspacios/otros/' + espacioSeleccionado,

            success: function () {

                for (let i = 0; i < otrosConfigurados.length; i++) {

                    $.ajax({

                        type: 'POST',

                        url: '/atributosEspacios',

                        data: {

                            espacio_id: espacioSeleccionado,
                            nombre: otrosConfigurados[i].nombre,
                            valor: otrosConfigurados[i].valor,
                            required: 0

                        }

                    });

                }

                hideModal('configAtributos');

            },

            error: function (response) {
                console.log(response.responseJSON);
                Lobibox.notify('error', {

                    title: response.responseJSON?.message ??
                        'No fue posible actualizar los atributos.',

                    showClass: 'fadeInDown',
                    hideClass: 'fadeUpDown',
                    delay: 5000,
                    sound: false,
                    icon: false,
                    width: 400

                });

            }

        });

        return;

    }
    $.ajax({

        type: 'POST',

        url: '/atributosEspacios',

        data: {

            espacio_id: espacioSeleccionado,
            nombre: nombre,
            valor: valor,
            required: required

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


            hideModal('configAtributos');

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

$(document).on('change', '.habilitarDia', function () {

    const dia = $(this).data('dia');


    if ($(this).is(':checked')) {

        agregarPrimerHorario(dia);


    }

    else {

        $('#contenedor_' + dia).empty();

    }

});


function agregarPrimerHorario(dia) {

    let html = construirHorario();

    $('#contenedor_' + dia).html(`

        <div id="horarios_${dia}">

            ${html}

        </div>

        <div class="text-center" style="margin-top:15px;">

            <button
                type="button"
                class="btn btn-success agregarHorario"
                data-dia="${dia}">

                <i class="fa fa-plus"></i>

                Agregar horario

            </button>

        </div>

    `);

    iniciarDatePicker();

}

$(document).on('click', '.agregarHorario', function () {

    const dia = $(this).data('dia');

    agregarHorario(dia);

});

function agregarHorario(dia) {

    $('#horarios_' + dia).append(

        construirHorario()

    );
    iniciarDatePicker();

}
function pintarOtros() {

    let html = '';

    otrosConfigurados.forEach(function (otro, index) {

        html += `

            <div class="row" style="margin-bottom:10px;">

                <div class="col-md-5">

                    <input
                        type="text"
                        class="form-control"
                        value="${otro.nombre}"
                        readonly>

                </div>

                <div class="col-md-5">

                    <input
                        type="text"
                        class="form-control"
                        value="${otro.valor}"
                        readonly>

                </div>

                <div class="col-md-2">

                    <button
                        type="button"
                        class="btn btn-danger eliminarOtro"
                        data-index="${index}">

                        X

                    </button>

                </div>

            </div>

        `;

    });

    $('#listaOtros').html(html);

}

$(document).on('click', '#agregarOtro', function () {

    if (
        $('#nombreOtro').val() == '' ||
        $('#valorOtro').val() == ''
    ) {

        return;

    }

    otrosConfigurados.push({

        nombre: $('#nombreOtro').val(),
        valor: $('#valorOtro').val()

    });

    $('#nombreOtro').val('');

    $('#valorOtro').val('');

    pintarOtros();

});

$(document).on('click', '.eliminarOtro', function () {

    let index = $(this).data('index');

    otrosConfigurados.splice(index, 1);

    pintarOtros();

});

let contadorHorarios = 0;


function construirHorario(desde = '', hasta = '') {

    contadorHorarios++;

    return `

        <div class="row horarioItem" style="margin-bottom:20px;">

            <div class="col-md-5">

                <label>

                    Desde

                </label>

                <div
                    class="input-group date horaPickerDesde"
                    id="desde_${contadorHorarios}">

                <input
                    type="text"
                    readonly
                    value="${desde}"
                    class="form-control horaDesde"/>

                    <span class="input-group-addon">

                        <i class="fa fa-clock-o"></i>

                    </span>

                </div>

            </div>


            <div class="col-md-5">

                <label>

                    Hasta

                </label>

                <div
                    class="input-group date horaPickerHasta"
                    id="hasta_${contadorHorarios}">

                   <input
                        type="text"
                        readonly
                        value="${hasta}"
                        class="form-control horaHasta"/>

                    <span class="input-group-addon">

                        <i class="fa fa-clock-o"></i>

                    </span>

                </div>

            </div>


            <div class="col-md-2 text-center">

                <label>

                    &nbsp;

                </label>

                <br>

                <button
                    type="button"
                    class="btn btn-danger eliminarHorario">

                    <i class="fa fa-trash"></i>

                </button>

            </div>

        </div>

    `;

}
$(document).on('click', '.eliminarHorario', function () {

    $(this)
        .closest('.horarioItem')
        .remove();

});

function iniciarDatePicker() {
    $('.horaPickerDesde').datetimepicker({

        format: 'hh:ii',
        autoclose: true,
        minuteStep: 30,
        showMeridian: false,
        startView: 1,
        minView: 0,
        maxView: 1,
        container: '.modal-body'

    });



    $('.horaPickerHasta').datetimepicker({

        format: 'hh:ii',
        autoclose: true,
        minuteStep: 30,
        showMeridian: false,
        startView: 1,
        minView: 0,
        maxView: 1,
        container: '.modal-body'

    });


}
/* _____________________Logica Horarios__________ */

function validarHorarios(horarios) {

    for (let dia in horarios) {

        let horariosDia = horarios[dia];

        for (let i = 0; i < horariosDia.length; i++) {

            let horario = horariosDia[i];

            //No validar los días deshabilitados
            if (!horario.enabled) {

                continue;

            }

            //La hora inicial debe ser menor que la final
            if (horario.from >= horario.to) {

                Lobibox.notify('error', {
                    title: 'La hora inicial debe ser menor que la hora final.',
                    showClass: 'fadeInDown',
                    hideClass: 'fadeUpDown',
                    delay: 5000,
                    sound: false,
                    icon: false,
                    width: 400
                });

                return false;

            }

            //No permitir horarios vacíos
            if (!horario.from || !horario.to) {

                Lobibox.notify('error', {
                    title: 'Todos los horarios habilitados deben estar completos.',
                    showClass: 'fadeInDown',
                    hideClass: 'fadeUpDown',
                    delay: 5000,
                    sound: false,
                    icon: false,
                    width: 400
                });

                return false;

            }

        }

    }

    return true;

}

const nombresDias = {

    monday: 'Lunes',
    tuesday: 'Martes',
    wednesday: 'Miércoles',
    thursday: 'Jueves',
    friday: 'Viernes',
    saturday: 'Sábado',
    sunday: 'Domingo'

};

function validarCruceHorarios(horarios) {

    for (let dia in horarios) {

        //Ignoramos los días deshabilitados
        if (!horarios[dia][0].enabled) {

            continue;

        }

        //Ordenamos los horarios por la hora inicial
        horarios[dia].sort(function (a, b) {

            return a.from.localeCompare(b.from);

        });


        for (let i = 0; i < horarios[dia].length - 1; i++) {

            let horarioActual = horarios[dia][i];

            let siguienteHorario = horarios[dia][i + 1];


            //Existe un cruce de horarios
            if (horarioActual.to > siguienteHorario.from) {

                Lobibox.notify('error', {

                    title: 'Existen horarios cruzados para el día ' + nombresDias[dia] + '.',
                    showClass: 'fadeInDown',
                    hideClass: 'fadeUpDown',
                    delay: 5000,
                    sound: false,
                    icon: false,
                    width: 400

                });

                return false;

            }

        }

    }

    return true;

}

function construirJSONHorarios() {

    let horarios = {

        monday: [],
        tuesday: [],
        wednesday: [],
        thursday: [],
        friday: [],
        saturday: [],
        sunday: []

    };

    const dias = [

        'monday',
        'tuesday',
        'wednesday',
        'thursday',
        'friday',
        'saturday',
        'sunday'

    ];

    dias.forEach(function (dia) {

        const habilitado = $(
            '.habilitarDia[data-dia="' + dia + '"]'
        ).is(':checked');

        if (!habilitado) {

            horarios[dia].push({

                enabled: false,
                from: null,
                to: null

            });

        }


        else {

            $('#horarios_' + dia + ' .horarioItem').each(function () {

                const desde = $(this).find('.horaDesde').val();

                const hasta = $(this).find('.horaHasta').val();


                horarios[dia].push({

                    enabled: true,
                    from: desde,
                    to: hasta

                });

            });

        }

    });

    return horarios;

}

async function consultarAtributos() {

    return $.ajax({

        type: 'GET',

        url: '/atributosEspacios/' + espacioSeleccionado,

        success: function (response) {

            atributosConfigurados = response.data;

        },

        error: function (response) {

            console.log(response);

        }

    });

}

function obtenerAtributo(nombre) {

    return atributosConfigurados.find(function (atributo) {

        return atributo.nombre == nombre;

    });

}