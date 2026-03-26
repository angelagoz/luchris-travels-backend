/* ========================================
   RUTAS: PAGOS CON STRIPE
   ======================================== */

const express = require('express');
const router = express.Router();
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const Reserva = require('../models/Reserva');

// ========================================
// POST - CREAR INTENTO DE PAGO
// ========================================

router.post('/crear-pago', async (req, res) => {
    try {
        const { reservaId, email, monto } = req.body;

        // Validar campos
        if (!reservaId || !email || !monto) {
            return res.status(400).json({
                success: false,
                error: 'Faltan campos requeridos'
            });
        }

        // Crear sesión de pago con Stripe
        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            line_items: [
                {
                    price_data: {
                        currency: 'usd',
                        product_data: {
                            name: `Reserva #${reservaId}`,
                            description: 'Pago de reserva de viaje'
                        },
                        unit_amount: Math.round(monto * 100) // Convertir a centavos
                    },
                    quantity: 1
                }
            ],
            mode: 'payment',
            success_url: `${process.env.FRONTEND_URL}/exito?reserva=${reservaId}`,
            cancel_url: `${process.env.FRONTEND_URL}/cancelado`,
            customer_email: email,
            metadata: {
                reservaId: reservaId
            }
        });

        res.json({
            success: true,
            sessionId: session.id,
            mensaje: 'Sesión de pago creada'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

// ========================================
// POST - WEBHOOK STRIPE (CONFIRMACION DE PAGO)
// ========================================

router.post('/webhook', express.raw({ type: 'application/json' }), async (req, res) => {
    const sig = req.headers['stripe-signature'];

    try {
        const event = stripe.webhooks.constructEvent(
            req.body,
            sig,
            process.env.STRIPE_WEBHOOK_SECRET
        );

        // Manejar evento de pago completado
        if (event.type === 'checkout.session.completed') {
            const session = event.data.object;
            const reservaId = session.metadata.reservaId;

            // Actualizar estado de la reserva
            await Reserva.findByIdAndUpdate(
                reservaId,
                {
                    estado: 'pagada',
                    pago: {
                        metodo: 'stripe',
                        transaccionId: session.payment_intent,
                        fecha: new Date(),
                        monto: session.amount_total / 100
                    }
                }
            );

            console.log(`✅ Pago confirmado para reserva: ${reservaId}`);
        }

        res.json({ received: true });
    } catch (error) {
        console.error('Error en webhook:', error.message);
        res.status(400).send(`Webhook Error: ${error.message}`);
    }
});

// ========================================
// GET - OBTENER ESTADO DE PAGO
// ========================================

router.get('/estado/:sessionId', async (req, res) => {
    try {
        const session = await stripe.checkout.sessions.retrieve(req.params.sessionId);

        res.json({
            success: true,
            estado: session.payment_status,
            cliente: session.customer_email,
            monto: session.amount_total / 100
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

// ========================================
// POST - PROCESAR PAGO MANUAL (TARJETA)
// ========================================

router.post('/pago-directo', async (req, res) => {
    try {
        const { reservaId, token, monto } = req.body;

        if (!reservaId || !token || !monto) {
            return res.status(400).json({
                success: false,
                error: 'Faltan campos requeridos'
            });
        }

        // Crear cargo en Stripe
        const charge = await stripe.charges.create({
            amount: Math.round(monto * 100),
            currency: 'usd',
            source: token,
            description: `Reserva #${reservaId}`
        });

        // Actualizar reserva
        const reserva = await Reserva.findByIdAndUpdate(
            reservaId,
            {
                estado: 'pagada',
                pago: {
                    metodo: 'tarjeta',
                    transaccionId: charge.id,
                    fecha: new Date(),
                    monto: monto
                }
            },
            { new: true }
        );

        res.json({
            success: true,
            mensaje: 'Pago procesado exitosamente',
            transaccionId: charge.id,
            reserva
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

module.exports = router;
