const express = require('express');
const router = express.Router();
const {
    getAllAsistencias,
    getAsistenciaById,
    createAsistencia,
    updateAsistencia,
    deleteAsistencia
} = require('../controllers/asistenciasController');

// GET /asistencias
router.get('/', getAllAsistencias);

// GET /asistencias/:id
router.get('/:id', getAsistenciaById);

// POST /asistencias
router.post('/', createAsistencia);

// PUT /asistencias/:id
router.put('/:id', updateAsistencia);

// DELETE /asistencias/:id
router.delete('/:id', deleteAsistencia);

module.exports = router;