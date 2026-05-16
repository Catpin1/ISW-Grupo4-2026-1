// src/controllers/evaluacionesController.js
const { getDbClient } = require('../db/connection'); // Asume que ya configuraste esto

// 1. Obtener todas las evaluaciones
const getAllEvaluaciones = async (req, res) => {
    const client = await getDbClient();
    try {
        // SQL: SELECT id, nota, puntaje_total FROM evaluaciones_teoricas
        const result = await client.query("SELECT id, nota, puntaje_total FROM evaluaciones_teoricas");
        
        res.json({
            success: true,
            data: result // Ajustar según el driver (ej: result.rows en pg, result en mysql2)
        });
    } catch (error) {
        console.error("Error al obtener evaluaciones:", error);
        res.status(500).json({ success: false, error: "Error del servidor" });
    }
};

// 2. Obtener una evaluación por ID
const getEvaluacionById = async (req, res) => {
    const client = await getDbClient();
    const { id } = req.params;

    try {
        if (isNaN(id)) return res.status(400).json({ error: "ID inválido" });

        const result = await client.query(
            "SELECT id, nota, puntaje_total FROM evaluaciones_teoricas WHERE id = ?",
            [id]
        );

        const evaluacion = result; // Ajustar según driver

        if (!evaluacion) {
            return res.status(404).json({ success: false, error: "Evaluación no encontrada" });
        }

        res.json({ success: true, data: evaluacion });
    } catch (error) {
        res.status(500).json({ success: false, error: "Error del servidor" });
    }
};

// 3. Crear nueva evaluación
const createEvaluacion = async (req, res) => {
    const client = await getDbClient();
    const { nota, puntaje_total } = req.body;

    try {
        // Validaciones estrictas
        if (nota === undefined || puntaje_total === undefined) {
            return res.status(400).json({ error: "Faltan campos: nota y puntaje_total" });
        }

        const notaNum = parseFloat(nota);
        const totalNum = parseInt(puntaje_total);

        if (isNaN(notaNum) || isNaN(totalNum)) {
            return res.status(400).json({ error: "La nota debe ser float y el puntaje_total un int" });
        }

        if (notaNum < 0) {
            return res.status(400).json({ error: "La nota no puede ser negativa" });
        }

        if (notaNum > totalNum) {
            return res.status(400).json({ error: "La nota no puede ser mayor al puntaje total" });
        }

        // SQL: INSERT INTO evaluaciones_teoricas (nota, puntaje_total) VALUES (?, ?)
        const result = await client.query(
            "INSERT INTO evaluaciones_teoricas (nota, puntaje_total) VALUES (?, ?)",
            [notaNum, totalNum]
        );

        res.status(201).json({
            success: true,
            mensaje: "Evaluación creada",
            data: { id: result.insertId, nota: notaNum, puntaje_total: totalNum }
        });

    } catch (error) {
        console.error("Error al crear evaluación:", error);
        res.status(500).json({ success: false, error: "Error al guardar en BD" });
    }
};

// 4. Actualizar evaluación
const updateEvaluacion = async (req, res) => {
    const client = await getDbClient();
    const { id } = req.params;
    const { nota, puntaje_total } = req.body;

    try {
        if (isNaN(id)) return res.status(400).json({ error: "ID inválido" });

        // Validar datos si se envían
        let notaVal = nota;
        let totalVal = puntaje_total;

        if (nota !== undefined) {
            notaVal = parseFloat(nota);
            if (isNaN(notaVal) || notaVal < 0) return res.status(400).json({ error: "Nota inválida" });
        }

        if (puntaje_total !== undefined) {
            totalVal = parseInt(puntaje_total);
            if (isNaN(totalVal) || totalVal <= 0) return res.status(400).json({ error: "Puntaje total inválido" });
        }

        // Verificar que la nota no exceda el total (si ambos se envían o ya existen)
        // Nota: En un caso real, deberías buscar el registro actual primero para validar si solo se actualiza la nota
        if (notaVal > totalVal) {
            return res.status(400).json({ error: "La nota no puede superar el puntaje total" });
        }

        const result = await client.query(
            "UPDATE evaluaciones_teoricas SET nota = ?, puntaje_total = ? WHERE id = ?",
            [notaVal, totalVal, id]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({ success: false, error: "Evaluación no encontrada" });
        }

        res.json({ success: true, mensaje: "Evaluación actualizada" });

    } catch (error) {
        res.status(500).json({ success: false, error: "Error al actualizar" });
    }
};

// 5. Eliminar evaluación
const deleteEvaluacion = async (req, res) => {
    const client = await getDbClient();
    const { id } = req.params;

    try {
        if (isNaN(id)) return res.status(400).json({ error: "ID inválido" });

        const result = await client.query("DELETE FROM evaluaciones_teoricas WHERE id = ?", [id]);

        if (result.affectedRows === 0) {
            return res.status(404).json({ error: "Evaluación no encontrada" });
        }

        res.json({ success: true, mensaje: "Evaluación eliminada" });
    } catch (error) {
        res.status(500).json({ success: false, error: "Error al eliminar" });
    }
};

module.exports = {
    getAllEvaluaciones,
    getEvaluacionById,
    createEvaluacion,
    updateEvaluacion,
    deleteEvaluacion
};