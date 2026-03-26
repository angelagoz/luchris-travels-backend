/* ========================================
   MODELO: RESERVA
   ======================================== */

const mongoose = require('mongoose');

const reservaSchema = new mongoose.Schema({
    usuario: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Usuario',
        required: false,
        default: null
    },
    datosInvitado: {
        nombre: String,
        email: String,
        telefono: String
    },
    crucero: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Crucero',
        required: true
    },
    fechaSalida: {
        type: Date,
        required: true
    },
    camarote: {
        tipo: String,
        precio: Number
    },
    pasajeros: [{
        nombre: String,
        apellido: String,
        cedula: String,
        pasaporte: String
    }],
    precioTotal: {
        type: Number,
        required: true
    },
    estado: {
        type: String,
        enum: ['pendiente', 'confirmada', 'pagada', 'cancelada'],
        default: 'pendiente'
    },
    pago: {
        metodo: String,
        transaccionId: String,
        fecha: Date,
        monto: Number
    },
    observaciones: String,
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Reserva', reservaSchema);
