const express = require('express');
const router = express.Router();
const {
    getAllEvaluacionesPracticas,
    getEvaluacionPracticaById,
    createEvaluacionPractica,
    updateEvaluacionPractica,
    deleteEvaluacionPractica
} = require('../controllers/evaluacionesPracticasController');

// GET /evaluaciones-practicas
router.get('/', getAllEvaluacionesPracticas);

// GET /evaluaciones-practicas/:id
router.get('/:id', getEvaluacionPracticaById);

// POST /evaluaciones-practicas
router.post('/', createEvaluacionPractica);

// PUT /evaluaciones-practicas/:id
router.put('/:id', updateEvaluacionPractica);

// DELETE /evaluaciones-practicas/:id
router.delete('/:id', deleteEvaluacionPractica);

module.exports = router;