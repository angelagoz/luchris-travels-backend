/* ========================================
   RUTAS: USUARIOS
   ======================================== */

const express = require('express');
const router = express.Router();
const Usuario = require('../models/Usuario');
const jwt = require('jsonwebtoken');

// ========================================
// FUNCIONES AUXILIARES
// ========================================

const generarToken = (usuarioId) => {
    return jwt.sign(
        { id: usuarioId },
        process.env.JWT_SECRET,
        { expiresIn: '30d' }
    );
};

// ========================================
// POST - REGISTRO DE USUARIO
// ========================================

router.post('/registro', async (req, res) => {
    try {
        const { nombre, apellido, email, telefono, cedula, contrasena } = req.body;

        // Validar campos requeridos
        if (!nombre || !apellido || !email || !cedula || !contrasena) {
            return res.status(400).json({
                success: false,
                error: 'Faltan campos requeridos'
            });
        }

        // Verificar si el email ya existe
        const usuarioExistente = await Usuario.findOne({ email });
        if (usuarioExistente) {
            return res.status(400).json({
                success: false,
                error: 'El email ya está registrado'
            });
        }

        // Verificar si la cédula ya existe
        const cedulaExistente = await Usuario.findOne({ cedula });
        if (cedulaExistente) {
            return res.status(400).json({
                success: false,
                error: 'Esta cédula ya está registrada'
            });
        }

        // Crear nuevo usuario
        const nuevoUsuario = new Usuario({
            nombre,
            apellido,
            email,
            telefono: telefono || '',
            cedula,
            contrasena
        });

        await nuevoUsuario.save();

        // Generar token
        const token = generarToken(nuevoUsuario._id);

        res.status(201).json({
            success: true,
            mensaje: 'Usuario registrado exitosamente',
            token,
            usuario: {
                id: nuevoUsuario._id,
                nombre: nuevoUsuario.nombre,
                apellido: nuevoUsuario.apellido,
                email: nuevoUsuario.email
            }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

// ========================================
// POST - LOGIN DE USUARIO
// ========================================

router.post('/login', async (req, res) => {
    try {
        const { email, contrasena } = req.body;

        // Validar campos
        if (!email || !contrasena) {
            return res.status(400).json({
                success: false,
                error: 'Email y contraseña son requeridos'
            });
        }

        // Buscar usuario
        const usuario = await Usuario.findOne({ email }).select('+contrasena');

        if (!usuario) {
            return res.status(401).json({
                success: false,
                error: 'Email o contraseña incorrectos'
            });
        }

        // Verificar contraseña
        const contrasenaValida = await usuario.compararContrasena(contrasena);

        if (!contrasenaValida) {
            return res.status(401).json({
                success: false,
                error: 'Email o contraseña incorrectos'
            });
        }

        // Generar token
        const token = generarToken(usuario._id);

        res.json({
            success: true,
            mensaje: 'Login exitoso',
            token,
            usuario: {
                id: usuario._id,
                nombre: usuario.nombre,
                apellido: usuario.apellido,
                email: usuario.email,
                rol: usuario.rol
            }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

// ========================================
// GET - OBTENER PERFIL DE USUARIO
// ========================================

router.get('/perfil/:id', async (req, res) => {
    try {
        const usuario = await Usuario.findById(req.params.id).select('-contrasena');

        if (!usuario) {
            return res.status(404).json({
                success: false,
                error: 'Usuario no encontrado'
            });
        }

        res.json({
            success: true,
            usuario
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

// ========================================
// PUT - ACTUALIZAR PERFIL DE USUARIO
// ========================================

router.put('/perfil/:id', async (req, res) => {
    try {
        const { nombre, apellido, telefono, direccion, ciudad, pais } = req.body;

        const usuarioActualizado = await Usuario.findByIdAndUpdate(
            req.params.id,
            {
                nombre,
                apellido,
                telefono,
                direccion,
                ciudad,
                pais
            },
            { new: true, runValidators: true }
        );

        if (!usuarioActualizado) {
            return res.status(404).json({
                success: false,
                error: 'Usuario no encontrado'
            });
        }

        res.json({
            success: true,
            mensaje: 'Perfil actualizado exitosamente',
            usuario: usuarioActualizado
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

module.exports = router;
