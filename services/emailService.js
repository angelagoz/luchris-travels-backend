/* ========================================
   SERVICIO DE EMAILS - LUCHRIS TRAVELS
   ======================================== */

const nodemailer = require('nodemailer');

// Configuración de Nodemailer
// Usando Gmail (requiere contraseña de aplicación)
// O puedes usar: SendGrid, Mailgun, AWS SES, etc.

const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST || 'smtp.gmail.com',
    port: process.env.EMAIL_PORT || 587,
    secure: false, // true para 465, false para otros puertos
    auth: {
        user: process.env.EMAIL_USER || 'tu_email@gmail.com',
        pass: process.env.EMAIL_PASSWORD || 'tu_contraseña_aplicacion'
    }
});

// ========================================
// PLANTILLA: Confirmación de Cotización
// ========================================

function generarEmailConfirmacionCotizacion(cotizacion) {
    return {
        subject: `✅ Cotización Recibida - LUCHRIS TRAVELS`,
        html: `
            <!DOCTYPE html>
            <html>
            <head>
                <style>
                    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
                    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
                    .header { background: linear-gradient(135deg, #003366 0%, #004d80 100%); color: white; padding: 20px; border-radius: 8px 8px 0 0; }
                    .content { background: #f9f9f9; padding: 20px; border: 1px solid #ddd; border-radius: 0 0 8px 8px; }
                    .info-box { background: white; padding: 15px; margin: 15px 0; border-left: 4px solid #E63946; border-radius: 4px; }
                    .button { display: inline-block; background: #E63946; color: white; padding: 12px 30px; text-decoration: none; border-radius: 4px; margin: 20px 0; }
                    .footer { text-align: center; color: #999; font-size: 0.9rem; margin-top: 20px; border-top: 1px solid #ddd; padding-top: 20px; }
                </style>
            </head>
            <body>
                <div class="container">
                    <div class="header">
                        <h1>¡Hola ${cotizacion.nombre}!</h1>
                        <p>Tu solicitud de cotización fue recibida correctamente</p>
                    </div>

                    <div class="content">
                        <p>Nos complace confirmar que hemos recibido tu solicitud de cotización.</p>

                        <div class="info-box">
                            <h3>📋 Detalles de tu solicitud:</h3>
                            <p><strong>Crucero:</strong> Oasis of the Seas</p>
                            <p><strong>Fecha deseada:</strong> ${cotizacion.fecha}</p>
                            <p><strong>Tipo de camarote:</strong> ${cotizacion.camarote}</p>
                            <p><strong>Cantidad de pasajeros:</strong> ${cotizacion.pasajeros}</p>
                            ${cotizacion.comentarios ? `<p><strong>Comentarios adicionales:</strong> ${cotizacion.comentarios}</p>` : ''}
                        </div>

                        <p>Nuestro equipo especializado en cruceros está revisando tu solicitud en este momento. Te contactaremos en las próximas <strong>24-48 horas</strong> con opciones personalizadas y precios especiales.</p>

                        <div class="info-box">
                            <h3>📞 Mientras tanto, puedes contactarnos:</h3>
                            <p><strong>Teléfono:</strong> +1 (829) 550-2847</p>
                            <p><strong>Email:</strong> luchristravels@gmail.com</p>
                            <p><strong>Horario:</strong> Lunes a Viernes 9:00 AM - 6:00 PM</p>
                        </div>

                        <p style="color: #E63946; font-weight: bold;">💡 OFERTA ESPECIAL: Reserva esta semana y obtén 15% de descuento en camarotes</p>

                        <p>Muchas gracias por confiar en LUCHRIS TRAVELS. Tus viajes, nuestra pasión.</p>
                    </div>

                    <div class="footer">
                        <p>&copy; 2026 LUCHRIS TRAVELS - Todos los derechos reservados</p>
                        <p>Calle Primera #11, Baní, República Dominicana</p>
                    </div>
                </div>
            </body>
            </html>
        `
    };
}

// ========================================
// PLANTILLA: Notificación para Admin
// ========================================

function generarEmailNotificacionAdmin(cotizacion) {
    return {
        subject: `🔔 NUEVA COTIZACIÓN - ${cotizacion.nombre}`,
        html: `
            <!DOCTYPE html>
            <html>
            <head>
                <style>
                    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
                    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
                    .header { background: #E63946; color: white; padding: 20px; border-radius: 8px 8px 0 0; }
                    .content { background: #f9f9f9; padding: 20px; border: 1px solid #ddd; border-radius: 0 0 8px 8px; }
                    .info-box { background: white; padding: 15px; margin: 15px 0; border: 1px solid #ddd; border-radius: 4px; }
                    .button { display: inline-block; background: #003366; color: white; padding: 12px 30px; text-decoration: none; border-radius: 4px; margin: 20px 0; }
                    .alert { background: #fff3cd; border-left: 4px solid #ffc107; padding: 15px; margin: 15px 0; border-radius: 4px; }
                </style>
            </head>
            <body>
                <div class="container">
                    <div class="header">
                        <h1>🔔 NUEVA COTIZACIÓN RECIBIDA</h1>
                    </div>

                    <div class="content">
                        <div class="alert">
                            <strong>⏰ Hora:</strong> ${new Date().toLocaleString('es-ES')}
                        </div>

                        <div class="info-box">
                            <h3>👤 Datos del Cliente:</h3>
                            <p><strong>Nombre:</strong> ${cotizacion.nombre}</p>
                            <p><strong>Email:</strong> <a href="mailto:${cotizacion.email}">${cotizacion.email}</a></p>
                            <p><strong>Teléfono:</strong> <a href="tel:${cotizacion.telefono}">${cotizacion.telefono}</a></p>
                        </div>

                        <div class="info-box">
                            <h3>🚢 Detalles de la Solicitud:</h3>
                            <p><strong>Fecha deseada:</strong> ${cotizacion.fecha}</p>
                            <p><strong>Tipo de camarote:</strong> ${cotizacion.camarote}</p>
                            <p><strong>Cantidad de pasajeros:</strong> ${cotizacion.pasajeros}</p>
                            ${cotizacion.comentarios ? `<p><strong>Comentarios:</strong> ${cotizacion.comentarios}</p>` : '<p><em>Sin comentarios adicionales</em></p>'}
                        </div>

                        <p><strong>ID de Cotización:</strong> ${cotizacion._id}</p>

                        <p>
                            <a href="https://luchris-travels-frontend.vercel.app/admin-login.html" class="button">
                                Ir al Panel Admin →
                            </a>
                        </p>

                        <p style="color: #666; font-size: 0.9rem;">
                            ⏱️ Recuerda responder en las próximas 24 horas para maximizar las posibilidades de conversión.
                        </p>
                    </div>
                </div>
            </body>
            </html>
        `
    };
}

// ========================================
// PLANTILLA: Respuesta a Cotización
// ========================================

function generarEmailRespuestaCliente(cotizacion, respuesta) {
    return {
        subject: `💬 Respuesta a tu Cotización - LUCHRIS TRAVELS`,
        html: `
            <!DOCTYPE html>
            <html>
            <head>
                <style>
                    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
                    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
                    .header { background: linear-gradient(135deg, #003366 0%, #004d80 100%); color: white; padding: 20px; border-radius: 8px 8px 0 0; }
                    .content { background: #f9f9f9; padding: 20px; border: 1px solid #ddd; border-radius: 0 0 8px 8px; }
                    .respuesta-box { background: white; padding: 20px; margin: 20px 0; border-left: 4px solid #28A745; border-radius: 4px; }
                    .button { display: inline-block; background: #E63946; color: white; padding: 12px 30px; text-decoration: none; border-radius: 4px; margin: 20px 0; }
                    .footer { text-align: center; color: #999; font-size: 0.9rem; margin-top: 20px; }
                </style>
            </head>
            <body>
                <div class="container">
                    <div class="header">
                        <h1>¡Hola ${cotizacion.nombre}!</h1>
                        <p>Tenemos tu respuesta sobre la cotización</p>
                    </div>

                    <div class="content">
                        <div class="respuesta-box">
                            <h3>✉️ Mensaje de LUCHRIS TRAVELS:</h3>
                            <p>${respuesta.replace(/\n/g, '<br>')}</p>
                            <p style="color: #999; font-size: 0.9rem; margin-top: 15px;">
                                📅 Recibido: ${new Date(cotizacion.respuesta.fecha).toLocaleString('es-ES')}
                            </p>
                        </div>

                        <p style="text-align: center;">
                            <a href="https://luchris-travels-frontend.vercel.app" class="button">
                                Visitar nuestro sitio →
                            </a>
                        </p>

                        <p>Si tienes más preguntas, no dudes en contactarnos:</p>
                        <p>
                            📞 +1 (829) 550-2847<br>
                            📧 luchristravels@gmail.com
                        </p>
                    </div>

                    <div class="footer">
                        <p>&copy; 2026 LUCHRIS TRAVELS - Tus viajes, nuestra pasión</p>
                    </div>
                </div>
            </body>
            </html>
        `
    };
}

// ========================================
// FUNCIONES PÚBLICAS
// ========================================

async function enviarConfirmacionCotizacion(cotizacion) {
    try {
        const mailOptions = {
            from: `LUCHRIS TRAVELS <${process.env.EMAIL_USER}>`,
            to: cotizacion.email,
            ...generarEmailConfirmacionCotizacion(cotizacion)
        };

        await transporter.sendMail(mailOptions);
        console.log(`✅ Email de confirmación enviado a: ${cotizacion.email}`);
        return true;

    } catch (error) {
        console.error(`❌ Error enviando email de confirmación:`, error.message);
        return false;
    }
}

async function enviarNotificacionAdmin(cotizacion, emailAdmin) {
    try {
        const mailOptions = {
            from: `LUCHRIS TRAVELS Sistema <${process.env.EMAIL_USER}>`,
            to: emailAdmin,
            ...generarEmailNotificacionAdmin(cotizacion)
        };

        await transporter.sendMail(mailOptions);
        console.log(`✅ Email de notificación enviado a admin: ${emailAdmin}`);
        return true;

    } catch (error) {
        console.error(`❌ Error enviando email de notificación:`, error.message);
        return false;
    }
}

async function enviarRespuestaCliente(cotizacion, emailAdmin) {
    try {
        if (!cotizacion.respuesta || !cotizacion.respuesta.contenido) {
            console.log('⚠️ No hay respuesta para enviar');
            return false;
        }

        const mailOptions = {
            from: `LUCHRIS TRAVELS <${process.env.EMAIL_USER}>`,
            to: cotizacion.email,
            ...generarEmailRespuestaCliente(cotizacion, cotizacion.respuesta.contenido)
        };

        await transporter.sendMail(mailOptions);
        console.log(`✅ Email de respuesta enviado a: ${cotizacion.email}`);
        return true;

    } catch (error) {
        console.error(`❌ Error enviando email de respuesta:`, error.message);
        return false;
    }
}

async function verificarConexion() {
    try {
        await transporter.verify();
        console.log('✅ Servicio de email listo para enviar');
        return true;
    } catch (error) {
        console.error('❌ Error en servicio de email:', error.message);
        return false;
    }
}

module.exports = {
    enviarConfirmacionCotizacion,
    enviarNotificacionAdmin,
    enviarRespuestaCliente,
    verificarConexion
};
