const { getDbClient } = require('../db/connection');
const salaAsignarSeSaPSI = require('../services/salaAsignarSeSaPSI.service'); 

// 1. Obtener TODAS las salas
const getAllSalas = async (req, res) => {
    const client = await getDbClient();
    try {
        // SQL Ejemplo (MySQL/PostgreSQL): SELECT id, tipo, cantidad_maxima, disponible FROM salas
        // const query = "SELECT * FROM salas"; 
        // const [rows] = await client.execute(query);
        
        // Simulación de lo que vendría de la BD:
        const rows = await client.query("SELECT id, tipo, cantidad_maxima, disponible FROM salas"); 

        res.json({
            success: true,
            data: rows
        });
    } catch (error) {
        console.error("Error al obtener salas:", error);
        res.status(500).json({ success: false, error: "Error del servidor al consultar la base de datos" });
    }
};

// 2. Obtener SALA por ID
const getSalaById = async (req, res) => {
    const client = await getDbClient();
    const { id } = req.params;

    try {
        // Validación de tipo
        if (!Number.isInteger(parseInt(id))) {
            return res.status(400).json({ error: "ID inválido" });
        }

        // SQL Ejemplo: SELECT * FROM salas WHERE id = ?
        // const result = await client.query("SELECT * FROM salas WHERE id = ?", [id]);
        
        const result = await client.query("SELECT * FROM salas WHERE id = ?", [id]);
        
        const sala = result; // Ajustar según el ORM/cliente usado

        if (!sala) {
            return res.status(404).json({ success: false, error: "Sala no encontrada" });
        }

        res.json({ success: true, data: sala });
    } catch (error) {
        console.error("Error al obtener sala:", error);
        res.status(500).json({ success: false, error: "Error del servidor" });
    }
};

// 3. CREAR SALA (INSERT)
const createSala = async (req, res) => {
    const client = await getDbClient();
    const { tipo, cantidad_maxima, disponible } = req.body;

    try {
        // Validaciones
        if (!tipo || typeof cantidad_maxima !== 'number' || !Number.isInteger(cantidad_maxima) || typeof disponible !== 'boolean') {
            return res.status(400).json({ error: "Datos inválidos. Verifica tipo (varchar), cantidad_maxima (int) y disponible (boolean)." });
        }

        // SQL Ejemplo: INSERT INTO salas (tipo, cantidad_maxima, disponible) VALUES (?, ?, ?)
        // const result = await client.query("INSERT INTO salas (tipo, cantidad_maxima, disponible) VALUES (?, ?, ?)", [tipo, cantidad_maxima, disponible]);
        
        const result = await client.query("INSERT INTO salas (tipo, cantidad_maxima, disponible) VALUES (?, ?, ?)", [tipo, cantidad_maxima, disponible]);

        res.status(201).json({
            success: true,
            mensaje: "Sala creada",
            data: { id: result.insertId, tipo, cantidad_maxima, disponible } // Ajustar según el cliente
        });
    } catch (error) {
        console.error("Error al crear sala:", error);
        res.status(500).json({ success: false, error: "Error al guardar en la base de datos" });
    }
};

// 4. ACTUALIZAR SALA (UPDATE)
const updateSala = async (req, res) => {
    const client = await getDbClient();
    const { id } = req.params;
    const { tipo, cantidad_maxima, disponible } = req.body;

    try {
        const result = await client.query(
            "UPDATE salas SET tipo = ?, cantidad_maxima = ?, disponible = ? WHERE id = ?",
            [tipo, cantidad_maxima, disponible, id]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({ error: "Sala no encontrada" });
        }

        res.json({ success: true, mensaje: "Sala actualizada" });
    } catch (error) {
        res.status(500).json({ error: "Error al actualizar" });
    }
};

// 5. ELIMINAR SALA (DELETE)
const deleteSala = async (req, res) => {
    const client = await getDbClient();
    const { id } = req.params;

    try {
        const result = await client.query("DELETE FROM salas WHERE id = ?", [id]);

        if (result.affectedRows === 0) {
            return res.status(404).json({ error: "Sala no encontrada" });
        }

        res.json({ success: true, mensaje: "Sala eliminada" });
    } catch (error) {
        res.status(500).json({ error: "Error al eliminar" });
    }
};

module.exports = {
    getAllSalas,
    getSalaById,
    createSala,
    updateSala,
    deleteSala
};