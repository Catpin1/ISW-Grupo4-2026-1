const express = require('express');
const router = express.Router();
const {
    getAllClases,
    getClaseById,
    createClase,
    updateClase,
    deleteClase
} = require('../controllers/clasesController');

// GET /clases
router.get('/', getAllClases);

// GET /clases/:id
router.get('/:id', getClaseById);

// POST /clases
router.post('/', createClase);

// PUT /clases/:id
router.put('/:id', updateClase);

// DELETE /clases/:id
router.delete('/:id', deleteClase);

module.exports = router;