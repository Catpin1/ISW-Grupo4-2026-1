const { getDbClient } = require('../db/connection');

// 1. Obtener todos los vehículos
const getAllVehiculos = async (req, res) => {
    const client = await getDbClient();
    try {
        const result = await client.query(
            "SELECT matricula, tipo, modelo, marca, disponible FROM Vehiculos ORDER BY marca ASC"
        );
        
        res.json({
            success: true,
            data: result
        });
    } catch (error) {
        console.error("Error al obtener vehículos:", error);
        res.status(500).json({ success: false, error: "Error del servidor" });
    }
};

// 2. Obtener vehículo por Matrícula (Clave Primaria)
const getVehiculoByMatricula = async (req, res) => {
    const client = await getDbClient();
    const { matricula } = req.params;

    try {
        // Validación básica: la matrícula no puede estar vacía
        if (!matricula || matricula.trim() === '') {
            return res.status(400).json({ error: "La matrícula no puede estar vacía" });
        }

        const result = await client.query(
            "SELECT matricula, tipo, modelo, marca, disponible FROM Vehiculos WHERE matricula = ?",
            [matricula.trim().toUpperCase()] // Normalizar a mayúsculas para evitar duplicados por caso
        );

        const vehiculo = result;

        if (!vehiculo) {
            return res.status(404).json({ success: false, error: "Vehículo no encontrado con esa matrícula" });
        }

        res.json({ success: true, data: vehiculo });
    } catch (error) {
        res.status(500).json({ success: false, error: "Error del servidor" });
    }
};

// 3. Crear nuevo vehículo
const createVehiculo = async (req, res) => {
    const client = await getDbClient();
    const { matricula, tipo, modelo, marca, disponible } = req.body;

    try {
        // Validaciones de campos requeridos
        if (!matricula || !tipo || !modelo || !marca) {
            return res.status(400).json({ 
                error: "Faltan campos obligatorios: matricula, tipo, modelo, marca" 
            });
        }

        // Normalizar matrícula (quitar espacios y pasar a mayúsculas)
        const matriculaNorm = matricula.trim().toUpperCase();

        // Validación de longitud de matrícula (ajusta el número según tu país, ej: 8 o 9)
        if (matriculaNorm.length < 4 || matriculaNorm.length > 15) {
            return res.status(400).json({ error: "La matrícula tiene un formato inválido (longitud entre 4 y 15 caracteres)" });
        }

        // Validación de tipos de datos
        if (tipo.length > 30 || modelo.length > 30 || marca.length > 30) {
            return res.status(400).json({ error: "Tipo, modelo o marca no pueden exceder 30 caracteres" });
        }

        // Validación de booleano
        const esDisponible = disponible === true || disponible === "true" || disponible === 1;

        // Verificar si ya existe (aunque la PK lo impide en BD, es mejor prevenir)
        const checkResult = await client.query("SELECT matricula FROM Vehiculos WHERE matricula = ?", [matriculaNorm]);
        if (checkResult.length > 0) {
            return res.status(409).json({ error: "Ya existe un vehículo con esa matrícula" });
        }

        // SQL: INSERT
        const result = await client.query(
            "INSERT INTO Vehiculos (matricula, tipo, modelo, marca, disponible) VALUES (?, ?, ?, ?, ?)",
            [matriculaNorm, tipo.trim(), modelo.trim(), marca.trim(), esDisponible]
        );

        // Nota: Como no hay autoincremental, usamos la matrícula como ID de retorno
        res.status(201).json({
            success: true,
            mensaje: "Vehículo registrado",
            data: {
                matricula: matriculaNorm,
                tipo: tipo.trim(),
                modelo: modelo.trim(),
                marca: marca.trim(),
                disponible: esDisponible
            }
        });

    } catch (error) {
        // Capturar error de clave duplicada de la BD
        if (error.code === 'ER_DUP_ENTRY' || error.code === 'SQLITE_CONSTRAINT_PRIMARYKEY') {
            return res.status(409).json({ success: false, error: "Ya existe un vehículo con esa matrícula" });
        }
        console.error("Error al crear vehículo:", error);
        res.status(500).json({ success: false, error: "Error al guardar en BD" });
    }
};

// 4. Actualizar vehículo
const updateVehiculo = async (req, res) => {
    const client = await getDbClient();
    const { matricula } = req.params; // La PK es la matrícula
    const { tipo, modelo, marca, disponible } = req.body;

    try {
        if (!matricula || matricula.trim() === '') {
            return res.status(400).json({ error: "La matrícula de la ruta es inválida" });
        }
        
        const matriculaNorm = matricula.trim().toUpperCase();

        // Verificar que el vehículo exista antes de actualizar
        const checkResult = await client.query("SELECT matricula FROM Vehiculos WHERE matricula = ?", [matriculaNorm]);
        if (checkResult.length === 0) {
            return res.status(404).json({ success: false, error: "Vehículo no encontrado" });
        }

        let query = "UPDATE Vehiculos SET ";
        let values = [];
        const updates = [];

        if (tipo !== undefined) {
            if (tipo.length > 30) return res.status(400).json({ error: "Tipo muy largo" });
            updates.push("tipo = ?");
            values.push(tipo.trim());
        }
        if (modelo !== undefined) {
            if (modelo.length > 30) return res.status(400).json({ error: "Modelo muy largo" });
            updates.push("modelo = ?");
            values.push(modelo.trim());
        }
        if (marca !== undefined) {
            if (marca.length > 30) return res.status(400).json({ error: "Marca muy larga" });
            updates.push("marca = ?");
            values.push(marca.trim());
        }
        if (disponible !== undefined) {
            const esDisponible = disponible === true || disponible === "true" || disponible === 1;
            updates.push("disponible = ?");
            values.push(esDisponible);
        }

        if (updates.length === 0) {
            return res.status(400).json({ error: "No hay datos para actualizar" });
        }

        query += updates.join(", ") + " WHERE matricula = ?";
        values.push(matriculaNorm);

        const result = await client.query(query, values);

        if (result.affectedRows === 0) {
            return res.status(404).json({ success: false, error: "No se pudo actualizar el vehículo" });
        }

        res.json({ success: true, mensaje: "Vehículo actualizado" });

    } catch (error) {
        if (error.code === 'ER_DUP_ENTRY') {
            return res.status(409).json({ error: "Ya existe otro vehículo con esa matrícula (si intentaste cambiarla)" });
        }
        res.status(500).json({ success: false, error: "Error al actualizar" });
    }
};

// 5. Eliminar vehículo
const deleteVehiculo = async (req, res) => {
    const client = await getDbClient();
    const { matricula } = req.params;

    try {
        if (!matricula || matricula.trim() === '') {
            return res.status(400).json({ error: "Matrícula inválida" });
        }
        
        const matriculaNorm = matricula.trim().toUpperCase();

        const result = await client.query("DELETE FROM Vehiculos WHERE matricula = ?", [matriculaNorm]);

        if (result.affectedRows === 0) {
            return res.status(404).json({ success: false, error: "Vehículo no encontrado" });
        }

        res.json({ success: true, mensaje: "Vehículo eliminado" });
    } catch (error) {
        if (error.code === 'ER_ROW_IS_REFERENCED') {
            return res.status(400).json({ success: false, error: "No se puede eliminar el vehículo porque tiene registros asociados (ej: rutas, mantenimientos)." });
        }
        res.status(500).json({ success: false, error: "Error al eliminar" });
    }
};

// Opcional: Actualizar disponibilidad (endpoint específico)
const updateDisponibilidad = async (req, res) => {
    const client = await getDbClient();
    const { matricula } = req.params;
    const { disponible } = req.body;

    try {
        if (!matricula) return res.status(400).json({ error: "Matrícula requerida" });
        if (disponible === undefined) return res.status(400).json({ error: "Campo 'disponible' requerido" });

        const matriculaNorm = matricula.trim().toUpperCase();
        const esDisponible = disponible === true || disponible === "true" || disponible === 1;

        const result = await client.query(
            "UPDATE Vehiculos SET disponible = ? WHERE matricula = ?",
            [esDisponible, matriculaNorm]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({ success: false, error: "Vehículo no encontrado" });
        }

        res.json({ success: true, mensaje: "Disponibilidad actualizada", data: { matricula: matriculaNorm, disponible: esDisponible } });

    } catch (error) {
        res.status(500).json({ success: false, error: "Error al actualizar disponibilidad" });
    }
};

module.exports = {
    getAllVehiculos,
    getVehiculoByMatricula,
    createVehiculo,
    updateVehiculo,
    deleteVehiculo,
    updateDisponibilidad // Opcional
};