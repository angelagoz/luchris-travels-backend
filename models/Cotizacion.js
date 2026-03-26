/* ========================================
   MODELO: COTIZACIÓN
   ======================================== */

const mongoose = require('mongoose');

const cotizacionSchema = new mongoose.Schema({
    nombre: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        trim: true,
        lowercase: true
    },
    telefono: {
        type: String,
        required: true,
        trim: true
    },
    fecha: {
        type: String,
        required: true
    },
    camarote: {
        type: String,
        required: true,
        enum: ['Interior', 'Balcón', 'Suite']
    },
    pasajeros: {
        type: Number,
        required: true,
        min: 1,
        max: 6
    },
    comentarios: {
        type: String,
        default: ''
    },
    estado: {
        type: String,
        enum: ['nueva', 'contactada', 'completada', 'cancelada'],
        default: 'nueva'
    },
    respuesta: {
        contenido: String,
        fecha: Date,
        enviada_por: String
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Cotizacion', cotizacionSchema);
