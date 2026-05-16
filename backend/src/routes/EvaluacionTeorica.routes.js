const express = require('express');
const router = express.Router();
const {
    getAllEvaluaciones,
    getEvaluacionById,
    createEvaluacion,
    updateEvaluacion,
    deleteEvaluacion
} = require('../controllers/evaluacionesController');

// GET /evaluaciones
router.get('/', getAllEvaluaciones);

// GET /evaluaciones/:id
router.get('/:id', getEvaluacionById);

// POST /evaluaciones
router.post('/', createEvaluacion);

// PUT /evaluaciones/:id
router.put('/:id', updateEvaluacion);

// DELETE /evaluaciones/:id
router.delete('/:id', deleteEvaluacion);

module.exports = router;