/* ========================================
   RUTAS: COTIZACIONES
   ======================================== */

const express = require('express');
const router = express.Router();
const Cotizacion = require('../models/Cotizacion');
const nodemailer = require('nodemailer');

// ========================================
// POST - CREAR NUEVA COTIZACIÓN
// ========================================

router.post('/', async (req, res) => {
    try {
        const { nombre, email, telefono, fecha, camarote, pasajeros, comentarios } = req.body;

        // Validación básica
        if (!nombre || !email || !telefono || !fecha || !camarote || !pasajeros) {
            return res.status(400).json({
                success: false,
                error: 'Faltan campos requeridos'
            });
        }

        // Crear nueva cotización
        const cotizacion = new Cotizacion({
            nombre,
            email,
            telefono,
            fecha,
            camarote,
            pasajeros,
            comentarios: comentarios || ''
        });

        await cotizacion.save();

        // Opcional: Enviar email de confirmación (si está configurado)
        try {
            await enviarEmailConfirmacion(cotizacion);
        } catch (emailError) {
            console.log('⚠️ Error enviando email:', emailError.message);
            // No fallar si el email no se envía
        }

        res.status(201).json({
            success: true,
            mensaje: 'Cotización recibida correctamente',
            cotizacionId: cotizacion._id
        });

    } catch (error) {
        console.error('Error creando cotización:', error);
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

// ========================================
// GET - OBTENER TODAS LAS COTIZACIONES (ADMIN)
// ========================================

router.get('/', async (req, res) => {
    try {
        // Aquí podría agregarse autenticación de admin
        const cotizaciones = await Cotizacion.find().sort({ createdAt: -1 });

        res.json({
            success: true,
            cantidad: cotizaciones.length,
            datos: cotizaciones
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

// ========================================
// GET - OBTENER UNA COTIZACIÓN POR ID
// ========================================

router.get('/:id', async (req, res) => {
    try {
        const cotizacion = await Cotizacion.findById(req.params.id);

        if (!cotizacion) {
            return res.status(404).json({
                success: false,
                error: 'Cotización no encontrada'
            });
        }

        res.json({
            success: true,
            datos: cotizacion
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

// ========================================
// PUT - ACTUALIZAR ESTADO Y RESPUESTA
// ========================================

router.put('/:id', async (req, res) => {
    try {
        const { estado, respuesta } = req.body;

        const cotizacion = await Cotizacion.findByIdAndUpdate(
            req.params.id,
            {
                estado,
                respuesta: respuesta ? {
                    contenido: respuesta,
                    fecha: new Date(),
                    enviada_por: 'admin'
                } : undefined,
                updatedAt: new Date()
            },
            { new: true }
        );

        if (!cotizacion) {
            return res.status(404).json({
                success: false,
                error: 'Cotización no encontrada'
            });
        }

        res.json({
            success: true,
            mensaje: 'Cotización actualizada',
            datos: cotizacion
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

// ========================================
// DELETE - ELIMINAR COTIZACIÓN
// ========================================

router.delete('/:id', async (req, res) => {
    try {
        const cotizacion = await Cotizacion.findByIdAndDelete(req.params.id);

        if (!cotizacion) {
            return res.status(404).json({
                success: false,
                error: 'Cotización no encontrada'
            });
        }

        res.json({
            success: true,
            mensaje: 'Cotización eliminada'
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

// ========================================
// FUNCIÓN AUXILIAR: ENVIAR EMAIL
// ========================================

async function enviarEmailConfirmacion(cotizacion) {
    // Esta función está lista para cuando configures un servicio de email
    // Por ahora, simplemente logueamos
    console.log(`📧 Cotización de ${cotizacion.nombre} (${cotizacion.email}) recibida`);

    // Descomenta esto cuando tengas configurado un servicio de email (Gmail, SendGrid, etc)
    /*
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASSWORD
        }
    });

    await transporter.sendMail({
        from: process.env.EMAIL_USER,
        to: cotizacion.email,
        subject: 'Cotización Recibida - LUCHRIS TRAVELS',
        html: `
            <h2>¡Hola ${cotizacion.nombre}!</h2>
            <p>Recibimos tu solicitud de cotización correctamente.</p>
            <p><strong>Detalles:</strong></p>
            <ul>
                <li>Fecha: ${cotizacion.fecha}</li>
                <li>Camarote: ${cotizacion.camarote}</li>
                <li>Pasajeros: ${cotizacion.pasajeros}</li>
            </ul>
            <p>Nos contactaremos con los detalles en breve.</p>
            <p>Teléfono: +1 (829) 550-2847</p>
        `
    });
    */
}

module.exports = router;
