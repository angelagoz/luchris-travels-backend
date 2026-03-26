/* ========================================
   RUTAS: RESERVAS
   ======================================== */

const express = require('express');
const router = express.Router();
const Reserva = require('../models/Reserva');
const Crucero = require('../models/Crucero');
const Usuario = require('../models/Usuario');

// ========================================
// GET - OBTENER TODAS LAS RESERVAS DEL USUARIO
// ========================================

router.get('/usuario/:usuarioId', async (req, res) => {
    try {
        const reservas = await Reserva.find({ usuario: req.params.usuarioId })
            .populate('usuario', 'nombre apellido email')
            .populate('crucero', 'nombre naviera');

        res.json({
            success: true,
            cantidad: reservas.length,
            datos: reservas
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

// ========================================
// GET - OBTENER UNA RESERVA POR ID
// ========================================

router.get('/:id', async (req, res) => {
    try {
        const reserva = await Reserva.findById(req.params.id)
            .populate('usuario')
            .populate('crucero');

        if (!reserva) {
            return res.status(404).json({
                success: false,
                error: 'Reserva no encontrada'
            });
        }

        res.json({
            success: true,
            dato: reserva
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

// ========================================
// POST - CREAR UNA RESERVA
// ========================================

router.post('/', async (req, res) => {
    try {
        const { usuarioId, cruceroId, fechaSalida, camarote, pasajeros, datosInvitado } = req.body;

        // Validar campos requeridos
        if (!cruceroId || !fechaSalida || !camarote) {
            return res.status(400).json({
                success: false,
                error: 'Faltan campos requeridos: cruceroId, fechaSalida, camarote'
            });
        }

        // Validar: debe ser usuario O invitado (no ambos)
        if (!usuarioId && !datosInvitado) {
            return res.status(400).json({
                success: false,
                error: 'Debe proporcionar usuarioId o datosInvitado'
            });
        }

        // Si es invitado, validar datos
        if (datosInvitado) {
            if (!datosInvitado.nombre || !datosInvitado.email || !datosInvitado.telefono) {
                return res.status(400).json({
                    success: false,
                    error: 'Datos de invitado incompletos (nombre, email, teléfono requeridos)'
                });
            }
        }

        // Si es usuario registrado, verificar que existe
        if (usuarioId) {
            const usuario = await Usuario.findById(usuarioId);
            if (!usuario) {
                return res.status(404).json({
                    success: false,
                    error: 'Usuario no encontrado'
                });
            }
        }

        // Verificar que el crucero existe
        const crucero = await Crucero.findById(cruceroId);
        if (!crucero) {
            return res.status(404).json({
                success: false,
                error: 'Crucero no encontrado'
            });
        }

        // Encontrar el precio del camarote
        const camaroteInfo = crucero.camarotes.find(c => c.tipo === camarote.tipo);
        if (!camaroteInfo) {
            return res.status(400).json({
                success: false,
                error: 'Tipo de camarote no válido'
            });
        }

        // Calcular precio total
        const cantidadPasajeros = pasajeros.length || 1;
        const precioTotal = camaroteInfo.precio * cantidadPasajeros;

        // Crear reserva
        const nuevaReserva = new Reserva({
            usuario: usuarioId || null,
            datosInvitado: datosInvitado || null,
            crucero: cruceroId,
            fechaSalida,
            camarote: {
                tipo: camarote.tipo,
                precio: camaroteInfo.precio
            },
            pasajeros,
            precioTotal,
            estado: 'pendiente'
        });

        await nuevaReserva.save();

        // Restar disponibilidad de camarotes
        camaroteInfo.disponibles -= cantidadPasajeros;
        await crucero.save();

        res.status(201).json({
            success: true,
            mensaje: 'Reserva creada exitosamente',
            dato: nuevaReserva
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

// ========================================
// PUT - ACTUALIZAR ESTADO DE RESERVA
// ========================================

router.put('/:id/estado', async (req, res) => {
    try {
        const { estado } = req.body;

        const estadosValidos = ['pendiente', 'confirmada', 'pagada', 'cancelada'];
        if (!estadosValidos.includes(estado)) {
            return res.status(400).json({
                success: false,
                error: 'Estado no válido'
            });
        }

        const reserva = await Reserva.findByIdAndUpdate(
            req.params.id,
            { estado },
            { new: true }
        );

        if (!reserva) {
            return res.status(404).json({
                success: false,
                error: 'Reserva no encontrada'
            });
        }

        res.json({
            success: true,
            mensaje: 'Estado actualizado exitosamente',
            dato: reserva
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

// ========================================
// DELETE - CANCELAR RESERVA
// ========================================

router.delete('/:id', async (req, res) => {
    try {
        const reserva = await Reserva.findByIdAndDelete(req.params.id);

        if (!reserva) {
            return res.status(404).json({
                success: false,
                error: 'Reserva no encontrada'
            });
        }

        // Restaurar disponibilidad de camarotes
        const crucero = await Crucero.findById(reserva.crucero);
        const camaroteInfo = crucero.camarotes.find(c => c.tipo === reserva.camarote.tipo);
        if (camaroteInfo) {
            camaroteInfo.disponibles += reserva.pasajeros.length;
            await crucero.save();
        }

        res.json({
            success: true,
            mensaje: 'Reserva cancelada exitosamente'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

module.exports = router;
