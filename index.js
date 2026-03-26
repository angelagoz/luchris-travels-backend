/* ========================================
   LUCHRIS TRAVELS - SERVIDOR BACKEND
   ======================================== */

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();

// ========================================
// MIDDLEWARE
// ========================================

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ========================================
// CONEXION A MONGODB
// ========================================

const conectarBD = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('✅ Conectado a MongoDB');
    } catch (error) {
        console.error('❌ Error al conectar a MongoDB:', error);
        process.exit(1);
    }
};

conectarBD();

// ========================================
// RUTAS
// ========================================

// Health check
app.get('/api/health', (req, res) => {
    res.json({ status: 'OK', mensaje: 'Servidor LUCHRIS TRAVELS funcionando' });
});

// Rutas de cruceros
app.use('/api/cruceros', require('./routes/cruceros'));

// Rutas de usuarios
app.use('/api/usuarios', require('./routes/usuarios'));

// Rutas de reservas
app.use('/api/reservas', require('./routes/reservas'));

// Rutas de pagos
app.use('/api/pagos', require('./routes/pagos'));

// ========================================
// MANEJO DE ERRORES
// ========================================

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({
        error: 'Error interno del servidor',
        mensaje: err.message
    });
});

// ========================================
// INICIAR SERVIDOR
// ========================================

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`🚀 Servidor LUCHRIS TRAVELS ejecutándose en puerto ${PORT}`);
    console.log(`📍 URL: http://localhost:${PORT}`);
});
