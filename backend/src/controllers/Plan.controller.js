const { getDbClient } = require('../db/connection');

// 1. Obtener todos los planes
const getAllPlanes = async (req, res) => {
    const client = await getDbClient();
    try {
        // Ordenamos por precio (opcional)
        const result = await client.query(
            "SELECT id, precio, descripcion FROM planes ORDER BY precio ASC"
        );
        
        res.json({
            success: true,
            data: result
        });
    } catch (error) {
        console.error("Error al obtener planes:", error);
        res.status(500).json({ success: false, error: "Error del servidor" });
    }
};

// 2. Obtener un plan por ID
const getPlanById = async (req, res) => {
    const client = await getDbClient();
    const { id } = req.params;

    try {
        if (isNaN(id)) return res.status(400).json({ error: "ID inválido" });

        const result = await client.query(
            "SELECT id, precio, descripcion FROM planes WHERE id = ?",
            [id]
        );

        const plan = result;

        if (!plan) {
            return res.status(404).json({ success: false, error: "Plan no encontrado" });
        }

        res.json({ success: true, data: plan });
    } catch (error) {
        res.status(500).json({ success: false, error: "Error del servidor" });
    }
};

// 3. Crear nuevo plan
const createPlan = async (req, res) => {
    const client = await getDbClient();
    const { precio, descripcion } = req.body;

    try {
        // Validación de campos requeridos
        if (precio === undefined || descripcion === undefined) {
            return res.status(400).json({ 
                error: "Faltan campos obligatorios: precio y descripcion" 
            });
        }

        // Validación de tipo y valor
        const precioNum = parseInt(precio);
        if (isNaN(precioNum) || precioNum < 0) {
            return res.status(400).json({ error: "El precio debe ser un entero no negativo" });
        }

        // Validación de longitud y contenido
        if (typeof descripcion !== 'string' || descripcion.trim() === '') {
            return res.status(400).json({ error: "La descripción debe ser un texto no vacío" });
        }
        
        if (descripcion.length > 500) {
            return res.status(400).json({ error: "La descripción no puede exceder 500 caracteres" });
        }

        // SQL: INSERT
        const result = await client.query(
            "INSERT INTO planes (precio, descripcion) VALUES (?, ?)",
            [precioNum, descripcion.trim()]
        );

        res.status(201).json({
            success: true,
            mensaje: "Plan creado",
            data: {
                id: result.insertId,
                precio: precioNum,
                descripcion: descripcion.trim()
            }
        });

    } catch (error) {
        console.error("Error al crear plan:", error);
        res.status(500).json({ success: false, error: "Error al guardar en BD" });
    }
};

// 4. Actualizar plan
const updatePlan = async (req, res) => {
    const client = await getDbClient();
    const { id } = req.params;
    const { precio, descripcion } = req.body;

    try {
        if (isNaN(id)) return res.status(400).json({ error: "ID inválido" });

        let query = "UPDATE planes SET ";
        let values = [];
        const updates = [];

        if (precio !== undefined) {
            const precioNum = parseInt(precio);
            if (isNaN(precioNum) || precioNum < 0) {
                return res.status(400).json({ error: "El precio debe ser un entero no negativo" });
            }
            updates.push("precio = ?");
            values.push(precioNum);
        }

        if (descripcion !== undefined) {
            if (typeof descripcion !== 'string' || descripcion.trim() === '') {
                return res.status(400).json({ error: "La descripción no puede estar vacía" });
            }
            if (descripcion.length > 500) {
                return res.status(400).json({ error: "La descripción no puede exceder 500 caracteres" });
            }
            updates.push("descripcion = ?");
            values.push(descripcion.trim());
        }

        if (updates.length === 0) {
            return res.status(400).json({ error: "No hay datos para actualizar" });
        }

        query += updates.join(", ") + " WHERE id = ?";
        values.push(parseInt(id));

        const result = await client.query(query, values);

        if (result.affectedRows === 0) {
            return res.status(404).json({ success: false, error: "Plan no encontrado" });
        }

        res.json({ success: true, mensaje: "Plan actualizado" });

    } catch (error) {
        res.status(500).json({ success: false, error: "Error al actualizar" });
    }
};

// 5. Eliminar plan
const deletePlan = async (req, res) => {
    const client = await getDbClient();
    const { id } = req.params;

    try {
        if (isNaN(id)) return res.status(400).json({ error: "ID inválido" });

        const result = await client.query("DELETE FROM planes WHERE id = ?", [id]);

        if (result.affectedRows === 0) {
            return res.status(404).json({ success: false, error: "Plan no encontrado" });
        }

        res.json({ success: true, mensaje: "Plan eliminado" });
    } catch (error) {
        // Manejo de integridad referencial si hay estudiantes vinculados a este plan
        if (error.code === 'ER_ROW_IS_REFERENCED' || error.code === 'ER_NO_REFERENCED_ROW_2') {
            return res.status(400).json({ success: false, error: "No se puede eliminar el plan porque está siendo utilizado por registros asociados." });
        }
        res.status(500).json({ success: false, error: "Error al eliminar" });
    }
};

module.exports = {
    getAllPlanes,
    getPlanById,
    createPlan,
    updatePlan,
    deletePlan
};