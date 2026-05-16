const { getDbClient } = require('../db/connection');

// 1. Obtener todas las clases
const getAllClases = async (req, res) => {
    const client = await getDbClient();
    try {
        // Ordenamos por fecha de inicio
        const result = await client.query(
            "SELECT id, modalidad, horaInicio, horaTermino FROM clases ORDER BY horaInicio ASC"
        );
        
        res.json({
            success: true,
            data: result
        });
    } catch (error) {
        console.error("Error al obtener clases:", error);
        res.status(500).json({ success: false, error: "Error del servidor" });
    }
};

// 2. Obtener una clase por ID
const getClaseById = async (req, res) => {
    const client = await getDbClient();
    const { id } = req.params;

    try {
        if (isNaN(id)) return res.status(400).json({ error: "ID inválido" });

        const result = await client.query(
            "SELECT id, modalidad, horaInicio, horaTermino FROM clases WHERE id = ?",
            [id]
        );

        const clase = result;

        if (!clase) {
            return res.status(404).json({ success: false, error: "Clase no encontrada" });
        }

        res.json({ success: true, data: clase });
    } catch (error) {
        res.status(500).json({ success: false, error: "Error del servidor" });
    }
};

// 3. Crear nueva clase
const createClase = async (req, res) => {
    const client = await getDbClient();
    const { modalidad, horaInicio, horaTermino } = req.body;

    try {
        // Validación de campos requeridos
        if (!modalidad || !horaInicio || !horaTermino) {
            return res.status(400).json({ 
                error: "Faltan campos obligatorios: modalidad, horaInicio, horaTermino" 
            });
        }

        // Validación de la modalidad (max 30 chars)
        if (modalidad.length > 30) {
            return res.status(400).json({ error: "La modalidad no puede exceder 30 caracteres" });
        }

        // Validación y parseo de fechas
        const inicioDate = new Date(horaInicio);
        const terminoDate = new Date(horaTermino);

        if (isNaN(inicioDate.getTime()) || isNaN(terminoDate.getTime())) {
            return res.status(400).json({ 
                error: "Formato de fecha inválido. Usa ISO 8601 (ej: 2026-05-16T08:00:00)" 
            });
        }

        // Validación lógica: El término debe ser posterior al inicio
        if (terminoDate <= inicioDate) {
            return res.status(400).json({ 
                error: "La hora de término debe ser posterior a la hora de inicio" 
            });
        }

        // SQL: INSERT
        const result = await client.query(
            "INSERT INTO clases (modalidad, horaInicio, horaTermino) VALUES (?, ?, ?)",
            [modalidad, inicioDate, terminoDate]
        );

        res.status(201).json({
            success: true,
            mensaje: "Clase creada",
            data: {
                id: result.insertId,
                modalidad,
                horaInicio: inicioDate,
                horaTermino: terminoDate
            }
        });

    } catch (error) {
        console.error("Error al crear clase:", error);
        res.status(500).json({ success: false, error: "Error al guardar en BD" });
    }
};

// 4. Actualizar clase
const updateClase = async (req, res) => {
    const client = await getDbClient();
    const { id } = req.params;
    const { modalidad, horaInicio, horaTermino } = req.body;

    try {
        if (isNaN(id)) return res.status(400).json({ error: "ID inválido" });

        let query = "UPDATE clases SET ";
        let values = [];
        const updates = [];

        // Manejo dinámico de campos
        if (modalidad !== undefined) {
            if (modalidad.length > 30) {
                return res.status(400).json({ error: "La modalidad no puede exceder 30 caracteres" });
            }
            updates.push("modalidad = ?");
            values.push(modalidad);
        }

        if (horaInicio !== undefined) {
            const inicioDate = new Date(horaInicio);
            if (isNaN(inicioDate.getTime())) {
                return res.status(400).json({ error: "Formato de horaInicio inválido" });
            }
            updates.push("horaInicio = ?");
            values.push(inicioDate);
        }

        if (horaTermino !== undefined) {
            const terminoDate = new Date(horaTermino);
            if (isNaN(terminoDate.getTime())) {
                return res.status(400).json({ error: "Formato de horaTermino inválido" });
            }
            updates.push("horaTermino = ?");
            values.push(terminoDate);
        }

        // Validación lógica de solapamiento: Si se actualizan ambas fechas, verificar orden
        if (horaInicio !== undefined && horaTermino !== undefined) {
            if (terminoDate <= inicioDate) {
                return res.status(400).json({ error: "La hora de término debe ser posterior a la de inicio" });
            }
        } else if (horaInicio !== undefined) {
            // Si solo se actualiza el inicio, necesitamos verificar contra el valor actual de término
            const current = await client.query("SELECT horaTermino FROM clases WHERE id = ?", [id]);
            if (current) {
                const terminoActual = new Date(current.horaTermino);
                if (inicioDate >= terminoActual) {
                    return res.status(400).json({ error: "El nuevo inicio no puede ser igual o posterior al término actual" });
                }
            }
        } else if (horaTermino !== undefined) {
            // Si solo se actualiza el término, verificar contra el nuevo inicio si se envió
            const inicioVal = horaInicio !== undefined ? inicioDate : (await client.query("SELECT horaInicio FROM clases WHERE id = ?", [id])).horaInicio;
            if (terminoDate <= new Date(inicioVal)) {
                return res.status(400).json({ error: "El término debe ser posterior al inicio" });
            }
        }

        if (updates.length === 0) {
            return res.status(400).json({ error: "No hay datos para actualizar" });
        }

        query += updates.join(", ") + " WHERE id = ?";
        values.push(parseInt(id));

        const result = await client.query(query, values);

        if (result.affectedRows === 0) {
            return res.status(404).json({ success: false, error: "Clase no encontrada" });
        }

        res.json({ success: true, mensaje: "Clase actualizada" });

    } catch (error) {
        res.status(500).json({ success: false, error: "Error al actualizar" });
    }
};

// 5. Eliminar clase
const deleteClase = async (req, res) => {
    const client = await getDbClient();
    const { id } = req.params;

    try {
        if (isNaN(id)) return res.status(400).json({ error: "ID inválido" });

        const result = await client.query("DELETE FROM clases WHERE id = ?", [id]);

        if (result.affectedRows === 0) {
            return res.status(404).json({ success: false, error: "Clase no encontrada" });
        }

        res.json({ success: true, mensaje: "Clase eliminada" });
    } catch (error) {
        // Manejo de errores de integridad referencial (si hay asistencias o evaluaciones vinculadas)
        if (error.code === 'ER_NO_REFERENCED_ROW_2' || error.code === 'ER_ROW_IS_REFERENCED') {
            return res.status(400).json({ success: false, error: "No se puede eliminar la clase porque tiene registros asociados (asistencias o evaluaciones)." });
        }
        res.status(500).json({ success: false, error: "Error al eliminar" });
    }
};

module.exports = {
    getAllClases,
    getClaseById,
    createClase,
    updateClase,
    deleteClase
};