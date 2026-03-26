/* ========================================
   RUTAS: CRUCEROS
   ======================================== */

const express = require('express');
const router = express.Router();
const Crucero = require('../models/Crucero');

// ========================================
// GET - OBTENER TODOS LOS CRUCEROS (CON FILTROS)
// ========================================

router.get('/', async (req, res) => {
    try {
        const { salida, duracion, naviera, destino } = req.query;

        // Construir filtro
        let filtro = {};

        if (salida) filtro.salida = salida; // 'Republica Dominicana' o 'Miami'
        if (naviera) filtro.naviera = new RegExp(naviera, 'i'); // búsqueda insensible a mayúsculas
        if (destino) filtro.destinos = { $elemMatch: { puerto: new RegExp(destino, 'i') } };
        if (duracion) filtro.duracion = { $gte: parseInt(duracion) }; // mayor o igual

        const cruceros = await Crucero.find(filtro).limit(50);

        res.json({
            success: true,
            cantidad: cruceros.length,
            datos: cruceros
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

// ========================================
// GET - OBTENER UN CRUCERO POR ID
// ========================================

router.get('/:id', async (req, res) => {
    try {
        const crucero = await Crucero.findById(req.params.id);

        if (!crucero) {
            return res.status(404).json({
                success: false,
                error: 'Crucero no encontrado'
            });
        }

        res.json({
            success: true,
            dato: crucero
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

// ========================================
// POST - CREAR UN CRUCERO (ADMIN)
// ========================================

router.post('/', async (req, res) => {
    try {
        const { nombre, naviera, descripcion, duracion, salida, destinos, camarotes, servicios } = req.body;

        // Validar campos requeridos
        if (!nombre || !naviera || !duracion || !salida) {
            return res.status(400).json({
                success: false,
                error: 'Faltan campos requeridos'
            });
        }

        const nuevoCrucero = new Crucero({
            nombre,
            naviera,
            descripcion,
            duracion,
            salida,
            destinos: destinos || [],
            camarotes: camarotes || [],
            servicios: servicios || []
        });

        await nuevoCrucero.save();

        res.status(201).json({
            success: true,
            mensaje: 'Crucero creado exitosamente',
            dato: nuevoCrucero
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

// ========================================
// PUT - ACTUALIZAR UN CRUCERO (ADMIN)
// ========================================

router.put('/:id', async (req, res) => {
    try {
        const crucero = await Crucero.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );

        if (!crucero) {
            return res.status(404).json({
                success: false,
                error: 'Crucero no encontrado'
            });
        }

        res.json({
            success: true,
            mensaje: 'Crucero actualizado exitosamente',
            dato: crucero
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

// ========================================
// DELETE - ELIMINAR UN CRUCERO (ADMIN)
// ========================================

router.delete('/:id', async (req, res) => {
    try {
        const crucero = await Crucero.findByIdAndDelete(req.params.id);

        if (!crucero) {
            return res.status(404).json({
                success: false,
                error: 'Crucero no encontrado'
            });
        }

        res.json({
            success: true,
            mensaje: 'Crucero eliminado exitosamente'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

module.exports = router;
