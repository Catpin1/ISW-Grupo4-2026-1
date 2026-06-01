const { getDbClient } = require('../db/connection');

// 1. Obtener todas las evaluaciones prácticas
const getAllEvaluacionesPracticas = async (req, res) => {
    const client = await getDbClient();
    try {
        const result = await client.query("SELECT * FROM evaluaciones_practicas ORDER BY id DESC");
        
        res.json({
            success: true,
            data: result
        });
    } catch (error) {
        console.error("Error al obtener evaluaciones prácticas:", error);
        res.status(500).json({ success: false, error: "Error del servidor" });
    }
};

// 2. Obtener una evaluación por ID
const getEvaluacionPracticaById = async (req, res) => {
    const client = await getDbClient();
    const { id } = req.params;

    try {
        if (isNaN(id)) return res.status(400).json({ error: "ID inválido" });

        const result = await client.query(
            "SELECT * FROM evaluaciones_practicas WHERE id = ?",
            [id]
        );

        const evaluacion = result;

        if (!evaluacion) {
            return res.status(404).json({ success: false, error: "Evaluación práctica no encontrada" });
        }

        res.json({ success: true, data: evaluacion });
    } catch (error) {
        res.status(500).json({ success: false, error: "Error del servidor" });
    }
};

// 3. Crear nueva evaluación práctica
const createEvaluacionPractica = async (req, res) => {
    const client = await getDbClient();
    const { resultado, numeroFaltaGrave, numeroFaltaMedia, numeroFaltaBaja } = req.body;

    try {
        // Validación de campos requeridos
        if (!resultado) {
            return res.status(400).json({ error: "El campo 'resultado' es obligatorio y no puede estar vacío" });
        }

        // Validación de longitud (varchar 30)
        if (resultado.length > 30) {
            return res.status(400).json({ error: "El resultado no puede exceder 30 caracteres" });
        }

        // Normalización de valores numéricos (pueden venir como null o undefined)
        const faltaGrave = numeroFaltaGrave !== undefined ? parseInt(numeroFaltaGrave) : 0;
        const faltaMedia = numeroFaltaMedia !== undefined ? parseInt(numeroFaltaMedia) : 0;
        const faltaBaja = numeroFaltaBaja !== undefined ? parseInt(numeroFaltaBaja) : 0;

        // Validación de tipos
        if (isNaN(faltaGrave) || faltaGrave < 0) {
            return res.status(400).json({ error: "numeroFaltaGrave debe ser un entero no negativo" });
        }
        if (isNaN(faltaMedia) || faltaMedia < 0) {
            return res.status(400).json({ error: "numeroFaltaMedia debe ser un entero no negativo" });
        }
        if (isNaN(faltaBaja) || faltaBaja < 0) {
            return res.status(400).json({ error: "numeroFaltaBaja debe ser un entero no negativo" });
        }

        // SQL: INSERT
        const result = await client.query(
            "INSERT INTO evaluaciones_practicas (resultado, numeroFaltaGrave, numeroFaltaMedia, numeroFaltaBaja) VALUES (?, ?, ?, ?)",
            [resultado, faltaGrave, faltaMedia, faltaBaja]
        );

        res.status(201).json({
            success: true,
            mensaje: "Evaluación práctica creada",
            data: {
                id: result.insertId,
                resultado,
                numeroFaltaGrave: faltaGrave,
                numeroFaltaMedia: faltaMedia,
                numeroFaltaBaja: faltaBaja
            }
        });

    } catch (error) {
        console.error("Error al crear evaluación práctica:", error);
        res.status(500).json({ success: false, error: "Error al guardar en BD" });
    }
};

// 4. Actualizar evaluación práctica
const updateEvaluacionPractica = async (req, res) => {
    const client = await getDbClient();
    const { id } = req.params;
    const { resultado, numeroFaltaGrave, numeroFaltaMedia, numeroFaltaBaja } = req.body;

    try {
        if (isNaN(id)) return res.status(400).json({ error: "ID inválido" });

        // Validar resultado si se envía
        if (resultado !== undefined) {
            if (resultado.length > 30) {
                return res.status(400).json({ error: "El resultado no puede exceder 30 caracteres" });
            }
        }

        // Construir query dinámico
        let query = "UPDATE evaluaciones_practicas SET ";
        let values = [];
        const updates = [];

        if (resultado !== undefined) {
            updates.push("resultado = ?");
            values.push(resultado);
        }
        if (numeroFaltaGrave !== undefined) {
            const val = parseInt(numeroFaltaGrave);
            if (isNaN(val) || val < 0) return res.status(400).json({ error: "Falta grave inválida" });
            updates.push("numeroFaltaGrave = ?");
            values.push(val);
        }
        if (numeroFaltaMedia !== undefined) {
            const val = parseInt(numeroFaltaMedia);
            if (isNaN(val) || val < 0) return res.status(400).json({ error: "Falta media inválida" });
            updates.push("numeroFaltaMedia = ?");
            values.push(val);
        }
        if (numeroFaltaBaja !== undefined) {
            const val = parseInt(numeroFaltaBaja);
            if (isNaN(val) || val < 0) return res.status(400).json({ error: "Falta baja inválida" });
            updates.push("numeroFaltaBaja = ?");
            values.push(val);
        }

        if (updates.length === 0) {
            return res.status(400).json({ error: "No hay datos para actualizar" });
        }

        query += updates.join(", ") + " WHERE id = ?";
        values.push(parseInt(id));

        const result = await client.query(query, values);

        if (result.affectedRows === 0) {
            return res.status(404).json({ success: false, error: "Evaluación práctica no encontrada" });
        }

        res.json({ success: true, mensaje: "Evaluación práctica actualizada" });

    } catch (error) {
        res.status(500).json({ success: false, error: "Error al actualizar" });
    }
};

// 5. Eliminar evaluación práctica
const deleteEvaluacionPractica = async (req, res) => {
    const client = await getDbClient();
    const { id } = req.params;

    try {
        if (isNaN(id)) return res.status(400).json({ error: "ID inválido" });

        const result = await client.query("DELETE FROM evaluaciones_practicas WHERE id = ?", [id]);

        if (result.affectedRows === 0) {
            return res.status(404).json({ success: false, error: "Evaluación práctica no encontrada" });
        }

        res.json({ success: true, mensaje: "Evaluación práctica eliminada" });
    } catch (error) {
        res.status(500).json({ success: false, error: "Error al eliminar" });
    }
};

module.exports = {
    getAllEvaluacionesPracticas,
    getEvaluacionPracticaById,
    createEvaluacionPractica,
    updateEvaluacionPractica,
    deleteEvaluacionPractica
};