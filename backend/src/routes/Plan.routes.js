const express = require('express');
const router = express.Router();
const {
    getAllPlanes,
    getPlanById,
    createPlan,
    updatePlan,
    deletePlan
} = require('../controllers/planesController');

// GET /planes
router.get('/', getAllPlanes);

// GET /planes/:id
router.get('/:id', getPlanById);

// POST /planes
router.post('/', createPlan);

// PUT /planes/:id
router.put('/:id', updatePlan);

// DELETE /planes/:id
router.delete('/:id', deletePlan);

module.exports = router;
