const { getDbClient } = require('../db/connection');

// 1. Obtener todas las asistencias (con joins opcionales para ver nombres)
const getAllAsistencias = async (req, res) => {
    const client = await getDbClient();
    try {
        // SQL: Selección básica
        // const query = "SELECT id, personaid, claseid, salaid, fecha FROM asistencias ORDER BY fecha DESC";
        const result = await client.query("SELECT id, personaid, claseid, salaid, fecha FROM asistencias ORDER BY fecha DESC");
        
        res.json({
            success: true,
            data: result
        });
    } catch (error) {
        console.error("Error al obtener asistencias:", error);
        res.status(500).json({ success: false, error: "Error del servidor" });
    }
};

// 2. Obtener asistencia por ID
const getAsistenciaById = async (req, res) => {
    const client = await getDbClient();
    const { id } = req.params;

    try {
        if (isNaN(id)) return res.status(400).json({ error: "ID inválido" });

        const result = await client.query(
            "SELECT id, personaid, claseid, salaid, fecha FROM asistencias WHERE id = ?",
            [id]
        );

        const asistencia = result;

        if (!asistencia) {
            return res.status(404).json({ success: false, error: "Registro de asistencia no encontrado" });
        }

        res.json({ success: true, data: asistencia });
    } catch (error) {
        res.status(500).json({ success: false, error: "Error del servidor" });
    }
};

// 3. Crear nueva asistencia
const createAsistencia = async (req, res) => {
    const client = await getDbClient();
    const { personaid, claseid, salaid, fecha } = req.body;

    try {
        // Validaciones de campos requeridos
        if (!personaid || !claseid || !salaid) {
            return res.status(400).json({ 
                error: "Faltan campos obligatorios: personaid, claseid, salaid" 
            });
        }

        // Validar que sean números enteros
        if (isNaN(parseInt(personaid)) || isNaN(parseInt(claseid)) || isNaN(parseInt(salaid))) {
            return res.status(400).json({ error: "Todos los IDs deben ser números enteros (int)" });
        }

        const personaidInt = parseInt(personaid);
        const claseidInt = parseInt(claseid);
        const salaidInt = parseInt(salaid);

        // Validación de fecha (opcional: si el usuario envía una fecha)
        let fechaVal = fecha;
        if (!fechaVal) {
            // Si no envían fecha, usamos la actual (el DEFAULT en BD lo maneja, pero aquí lo dejamos explícito)
            fechaVal = new Date(); 
        } else {
            const dateObj = new Date(fechaVal);
            if (isNaN(dateObj.getTime())) {
                return res.status(400).json({ error: "Formato de fecha inválido. Usa ISO 8601 (ej: 2023-10-25T10:00:00)" });
            }
            fechaVal = dateObj;
        }

        // Opcional: Validar integridad referencial (verificar que los IDs existen en sus tablas)
        // Esto puede ser lento si hay mucha carga, depende de tu estrategia de BD.
        // const [existPerson] = await client.query("SELECT id FROM personas WHERE id = ?", [personaidInt]);
        // if (existPerson.length === 0) return res.status(400).json({ error: "Persona no encontrada" });
        // ... (repetir para clase y sala)

        // SQL: INSERT INTO asistencias (personaid, claseid, salaid, fecha) VALUES (?, ?, ?, ?)
        const result = await client.query(
            "INSERT INTO asistencias (personaid, claseid, salaid, fecha) VALUES (?, ?, ?, ?)",
            [personaidInt, claseidInt, salaidInt, fechaVal]
        );

        res.status(201).json({
            success: true,
            mensaje: "Asistencia registrada",
            data: { 
                id: result.insertId, 
                personaid: personaidInt, 
                claseid: claseidInt, 
                salaid: salaidInt, 
                fecha: fechaVal 
            }
        });

    } catch (error) {
        // Manejo de errores de integridad referencial (duplicados o IDs no existentes)
        if (error.code === 'ER_DUP_ENTRY' || error.code === 'SQLITE_CONSTRAINT_UNIQUE') {
            return res.status(409).json({ success: false, error: "Esta asistencia ya está registrada para esta combinación de persona/clase/sala/fecha." });
        }
        if (error.code === 'ER_NO_REFERENCED_ROW_2' || error.code === 'SQLITE_CONSTRAINT_FOREIGNKEY') {
            return res.status(400).json({ success: false, error: "Uno de los IDs referenciados (persona, clase o sala) no existe." });
        }
        
        console.error("Error al crear asistencia:", error);
        res.status(500).json({ success: false, error: "Error al guardar en BD" });
    }
};

// 4. Actualizar asistencia (usualmente solo la fecha o marcar asistencia)
const updateAsistencia = async (req, res) => {
    const client = await getDbClient();
    const { id } = req.params;
    const { personaid, claseid, salaid, fecha } = req.body;

    try {
        if (isNaN(id)) return res.status(400).json({ error: "ID inválido" });

        // Construir query dinámicamente para actualizar solo los campos enviados
        let query = "UPDATE asistencias SET ";
        let values = [];
        const updates = [];

        if (personaid !== undefined) {
            updates.push("personaid = ?");
            values.push(parseInt(personaid));
        }
        if (claseid !== undefined) {
            updates.push("claseid = ?");
            values.push(parseInt(claseid));
        }
        if (salaid !== undefined) {
            updates.push("salaid = ?");
            values.push(parseInt(salaid));
        }
        if (fecha !== undefined) {
            updates.push("fecha = ?");
            values.push(new Date(fecha));
        }

        if (updates.length === 0) {
            return res.status(400).json({ error: "No hay datos para actualizar" });
        }

        query += updates.join(", ") + " WHERE id = ?";
        values.push(parseInt(id));

        const result = await client.query(query, values);

        if (result.affectedRows === 0) {
            return res.status(404).json({ success: false, error: "Asistencia no encontrada" });
        }

        res.json({ success: true, mensaje: "Asistencia actualizada" });

    } catch (error) {
        if (error.code === 'ER_DUP_ENTRY') {
            return res.status(409).json({ success: false, error: "Conflicto de duplicado al actualizar." });
        }
        res.status(500).json({ success: false, error: "Error al actualizar" });
    }
};

// 5. Eliminar asistencia
const deleteAsistencia = async (req, res) => {
    const client = await getDbClient();
    const { id } = req.params;

    try {
        if (isNaN(id)) return res.status(400).json({ error: "ID inválido" });

        const result = await client.query("DELETE FROM asistencias WHERE id = ?", [id]);

        if (result.affectedRows === 0) {
            return res.status(404).json({ success: false, error: "Asistencia no encontrada" });
        }

        res.json({ success: true, mensaje: "Asistencia eliminada" });
    } catch (error) {
        res.status(500).json({ success: false, error: "Error al eliminar" });
    }
};

module.exports = {
    getAllAsistencias,
    getAsistenciaById,
    createAsistencia,
    updateAsistencia,
    deleteAsistencia
};
