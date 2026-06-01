const express = require('express');
const router = express.Router();
const {
    getAllVehiculos,
    getVehiculoByMatricula,
    createVehiculo,
    updateVehiculo,
    deleteVehiculo,
    updateDisponibilidad
} = require('../controllers/vehiculosController');

// GET /vehiculos
router.get('/', getAllVehiculos);

// GET /vehiculos/:matricula
router.get('/:matricula', getVehiculoByMatricula);

// POST /vehiculos
router.post('/', createVehiculo);

// PUT /vehiculos/:matricula
router.put('/:matricula', updateVehiculo);

// PATCH /vehiculos/:matricula/disponible (Opcional, para actualizar solo el estado)
router.patch('/:matricula/disponible', updateDisponibilidad);

// DELETE /vehiculos/:matricula
router.delete('/:matricula', deleteVehiculo);

module.exports = router;