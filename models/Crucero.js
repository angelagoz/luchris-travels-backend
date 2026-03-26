/* ========================================
   MODELO: CRUCERO
   ======================================== */

const mongoose = require('mongoose');

const cruceroSchema = new mongoose.Schema({
    nombre: {
        type: String,
        required: true,
        trim: true
    },
    naviera: {
        type: String,
        required: true
    },
    descripcion: {
        type: String
    },
    duracion: {
        type: Number,
        required: true,
        description: 'Días de duración'
    },
    salida: {
        type: String,
        enum: ['Republica Dominicana', 'Miami'],
        required: true
    },
    destinos: [{
        puerto: String,
        dias: Number
    }],
    imagenes: [{
        url: String,
        alt: String
    }],
    camarotes: [{
        tipo: {
            type: String,
            enum: ['interior', 'balcon', 'suite']
        },
        precio: Number,
        disponibles: Number,
        descripcion: String
    }],
    servicios: [String],
    politicas: {
        cancelacion: String,
        documentos: String,
        pago: String
    },
    fechas: [{
        salida: Date,
        retorno: Date,
        disponible: Boolean
    }],
    calificacion: {
        type: Number,
        default: 0,
        min: 0,
        max: 5
    },
    resenas: Number,
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Crucero', cruceroSchema);
