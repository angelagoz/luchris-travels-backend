/* ========================================
   CONFIGURACION DE MONGODB
   ======================================== */

const mongoose = require('mongoose');

const conectarBD = async () => {
    try {
        const conexion = await mongoose.connect(process.env.MONGODB_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });

        console.log('✅ Base de datos conectada:', conexion.connection.host);
        return conexion;
    } catch (error) {
        console.error('❌ Error de conexión:', error.message);
        process.exit(1);
    }
};

module.exports = conectarBD;
