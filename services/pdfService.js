/* ========================================
   SERVICIO DE GENERACIÓN DE PDFs
   ======================================== */

const PDFDocument = require('pdfkit');
const Cotizacion = require('../models/Cotizacion');

// ========================================
// GENERAR REPORTE DE COTIZACIÓN
// ========================================

async function generarReporteCotizacion(cotizacionId, res) {
    try {
        const cotizacion = await Cotizacion.findById(cotizacionId);

        if (!cotizacion) {
            return res.status(404).json({
                success: false,
                error: 'Cotización no encontrada'
            });
        }

        const doc = new PDFDocument();
        const filename = `cotizacion-${cotizacionId}.pdf`;

        // Headers HTTP
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);

        doc.pipe(res);

        // Encabezado
        doc.fontSize(24).font('Helvetica-Bold').text('LUCHRIS TRAVELS', 50, 50);
        doc.fontSize(10).font('Helvetica').text('Agencia de Viajes - Cruceros y Tours', 50, 75);
        doc.fontSize(9).text('Teléfono: +1 (829) 550-2847', 50, 90);
        doc.text('Email: luchristravels@gmail.com', 50, 105);

        // Línea separadora
        doc.moveTo(50, 130).lineTo(550, 130).stroke();

        // Título
        doc.fontSize(18).font('Helvetica-Bold').text('COTIZACIÓN', 50, 150);
        doc.fontSize(10).font('Helvetica').text(`ID: ${cotizacionId}`, 50, 175);
        doc.text(`Fecha: ${new Date().toLocaleDateString('es-ES')}`, 50, 190);

        // Datos del Cliente
        doc.fontSize(12).font('Helvetica-Bold').text('DATOS DEL CLIENTE', 50, 220);
        doc.fontSize(10).font('Helvetica');
        doc.text(`Nombre: ${cotizacion.nombre}`, 50, 240);
        doc.text(`Email: ${cotizacion.email}`, 50, 255);
        doc.text(`Teléfono: ${cotizacion.telefono}`, 50, 270);

        // Detalles de la Solicitud
        doc.fontSize(12).font('Helvetica-Bold').text('DETALLES DE LA SOLICITUD', 50, 300);
        doc.fontSize(10).font('Helvetica');
        doc.text(`Crucero: Oasis of the Seas`, 50, 320);
        doc.text(`Fecha de Salida: ${cotizacion.fecha}`, 50, 335);
        doc.text(`Tipo de Camarote: ${cotizacion.camarote}`, 50, 350);
        doc.text(`Cantidad de Pasajeros: ${cotizacion.pasajeros}`, 50, 365);

        if (cotizacion.comentarios) {
            doc.text(`Comentarios: ${cotizacion.comentarios}`, 50, 380);
        }

        // Cálculo de Precio
        const preciosPorCamarote = {
            'Interior': 899,
            'Balcón': 1299,
            'Suite': 2499
        };
        const precioPorPersona = preciosPorCamarote[cotizacion.camarote] || 899;
        const subtotal = precioPorPersona * cotizacion.pasajeros;
        const impuestos = subtotal * 0.10;
        const total = subtotal + impuestos;

        // Tabla de Precios
        doc.fontSize(12).font('Helvetica-Bold').text('DESGLOSE DE PRECIOS', 50, 420);
        doc.fontSize(10).font('Helvetica');
        doc.text(`Precio por Persona: $${precioPorPersona.toFixed(2)}`, 50, 440);
        doc.text(`Cantidad de Pasajeros: ${cotizacion.pasajeros}`, 50, 455);
        doc.text(`Subtotal: $${subtotal.toFixed(2)}`, 50, 470);
        doc.text(`Impuestos (10%): $${impuestos.toFixed(2)}`, 50, 485);

        // Línea separadora
        doc.moveTo(50, 505).lineTo(550, 505).stroke();

        doc.fontSize(14).font('Helvetica-Bold').text(`TOTAL: $${total.toFixed(2)}`, 50, 520);

        // Estado
        doc.fontSize(10).font('Helvetica');
        doc.text(`Estado: ${cotizacion.estado.toUpperCase()}`, 50, 560);

        if (cotizacion.respuesta && cotizacion.respuesta.contenido) {
            doc.fontSize(12).font('Helvetica-Bold').text('RESPUESTA DE LUCHRIS TRAVELS', 50, 590);
            doc.fontSize(10).font('Helvetica').text(cotizacion.respuesta.contenido, 50, 610, {
                width: 500,
                align: 'left'
            });
        }

        // Pie de página
        doc.fontSize(8).font('Helvetica').text(
            '© 2026 LUCHRIS TRAVELS - Todos los derechos reservados',
            50,
            740,
            { align: 'center' }
        );

        doc.end();

    } catch (error) {
        console.error('Error generando PDF:', error);
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
}

// ========================================
// GENERAR REPORTE DE ESTADÍSTICAS
// ========================================

async function generarReporteEstadisticas(res) {
    try {
        const cotizaciones = await Cotizacion.find();

        const doc = new PDFDocument({ size: 'A4', margin: 50 });
        const filename = `reporte-estadisticas-${new Date().getTime()}.pdf`;

        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);

        doc.pipe(res);

        // Encabezado
        doc.fontSize(24).font('Helvetica-Bold').text('LUCHRIS TRAVELS', 50, 50);
        doc.fontSize(12).font('Helvetica').text('REPORTE DE ESTADÍSTICAS Y ANÁLISIS', 50, 80);
        doc.fontSize(10).text(`Generado: ${new Date().toLocaleString('es-ES')}`, 50, 100);

        // Línea separadora
        doc.moveTo(50, 120).lineTo(550, 120).stroke();

        // Resumen Ejecutivo
        doc.fontSize(14).font('Helvetica-Bold').text('RESUMEN EJECUTIVO', 50, 140);

        const total = cotizaciones.length;
        const completadas = cotizaciones.filter(c => c.estado === 'completada').length;
        const contactadas = cotizaciones.filter(c => c.estado === 'contactada').length;
        const nuevas = cotizaciones.filter(c => c.estado === 'nueva').length;
        const conversion = total > 0 ? Math.round((completadas / total) * 100) : 0;

        doc.fontSize(10).font('Helvetica');
        doc.text(`Total de Cotizaciones: ${total}`, 50, 165);
        doc.text(`Nuevas: ${nuevas} | Contactadas: ${contactadas} | Completadas: ${completadas}`, 50, 180);
        doc.text(`Tasa de Conversión: ${conversion}%`, 50, 195);

        // Desglose por Camarote
        const porCamarote = {};
        cotizaciones.forEach(c => {
            porCamarote[c.camarote] = (porCamarote[c.camarote] || 0) + 1;
        });

        doc.fontSize(12).font('Helvetica-Bold').text('DESGLOSE POR TIPO DE CAMAROTE', 50, 225);
        doc.fontSize(10).font('Helvetica');
        let y = 245;
        Object.entries(porCamarote).forEach(([camarote, cantidad]) => {
            const porcentaje = Math.round((cantidad / total) * 100);
            doc.text(`${camarote}: ${cantidad} solicitudes (${porcentaje}%)`, 50, y);
            y += 15;
        });

        // Fechas Populares
        const porFecha = {};
        cotizaciones.forEach(c => {
            porFecha[c.fecha] = (porFecha[c.fecha] || 0) + 1;
        });

        const topFechas = Object.entries(porFecha)
            .sort((a, b) => b[1] - a[1])
            .slice(0, 5);

        doc.fontSize(12).font('Helvetica-Bold').text('TOP 5 FECHAS MÁS POPULARES', 50, y + 20);
        doc.fontSize(10).font('Helvetica');
        y += 40;
        topFechas.forEach(([fecha, cantidad]) => {
            const porcentaje = Math.round((cantidad / total) * 100);
            doc.text(`${fecha}: ${cantidad} solicitudes (${porcentaje}%)`, 50, y);
            y += 15;
        });

        // Cálculo de Ingresos
        const preciosPorCamarote = {
            'Interior': 899,
            'Balcón': 1299,
            'Suite': 2499
        };
        let totalIngresos = 0;
        cotizaciones.forEach(c => {
            const precio = preciosPorCamarote[c.camarote] || 0;
            totalIngresos += precio * c.pasajeros;
        });

        doc.fontSize(12).font('Helvetica-Bold').text('INGRESOS POTENCIALES', 50, y + 20);
        doc.fontSize(10).font('Helvetica').text(`Total Estimado: $${totalIngresos.toLocaleString('es-ES')}`, 50, y + 40);

        // Pie de página
        doc.fontSize(8).font('Helvetica').text(
            '© 2026 LUCHRIS TRAVELS - Confidencial',
            50,
            740,
            { align: 'center' }
        );

        doc.end();

    } catch (error) {
        console.error('Error generando reporte:', error);
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
}

module.exports = {
    generarReporteCotizacion,
    generarReporteEstadisticas
};
