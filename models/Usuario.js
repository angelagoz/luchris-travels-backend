/* ========================================
   MODELO: USUARIO
   ======================================== */

const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const usuarioSchema = new mongoose.Schema({
    nombre: {
        type: String,
        required: true,
        trim: true
    },
    apellido: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        match: /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    },
    telefono: {
        type: String,
        required: true
    },
    contrasena: {
        type: String,
        required: true,
        minlength: 6,
        select: false
    },
    cedula: {
        type: String,
        required: true,
        unique: true
    },
    pasaporte: String,
    direccion: String,
    ciudad: String,
    pais: String,
    rol: {
        type: String,
        enum: ['cliente', 'admin'],
        default: 'cliente'
    },
    activo: {
        type: Boolean,
        default: true
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

// Hash de contraseña antes de guardar
usuarioSchema.pre('save', async function(next) {
    if (!this.isModified('contrasena')) return next();

    try {
        const salt = await bcrypt.genSalt(10);
        this.contrasena = await bcrypt.hash(this.contrasena, salt);
        next();
    } catch (error) {
        next(error);
    }
});

// Método para comparar contraseñas
usuarioSchema.methods.compararContrasena = async function(contrasenaIngresada) {
    return await bcrypt.compare(contrasenaIngresada, this.contrasena);
};

module.exports = mongoose.model('Usuario', usuarioSchema);
