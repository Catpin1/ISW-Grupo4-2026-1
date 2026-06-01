// ... dentro de tu función createAsistencia(req, res)

const { personaid, claseid, salaid, fecha } = req.body;

// 1. Validar campos requeridos
if (!personaid || !claseid || !fecha) {
    return res.status(400).json({ 
        success: false, 
        error: "Los campos personaid, claseid y fecha son obligatorios." 
    });
}

// 2. Validar tipos de datos (deben ser enteros)
const pId = parseInt(personaid);
const cId = parseInt(claseid);
const sId = salaid !== null && salaid !== undefined ? parseInt(salaid) : null;

if (isNaN(pId) || isNaN(cId)) {
    return res.status(400).json({ 
        success: false, 
        error: "personaid y claseid deben ser números enteros válidos." 
    });
}

if (salaid !== null && salaid !== undefined && isNaN(sId)) {
    return res.status(400).json({ 
        success: false, 
        error: "salaid debe ser un número entero si se proporciona." 
    });
}

// 3. Validar formato de fecha
const fechaObj = new Date(fecha);
if (isNaN(fechaObj.getTime())) {
    return res.status(400).json({ 
        success: false, 
        error: "Formato de fecha inválido. Usa ISO 8601 (ej: 2026-05-16T10:00:00)." 
    });
}

// 4. Validar lógica: La fecha no puede ser futura (opcional, pero común)
// Descomenta si necesitas evitar asistencias futuras
/*
const hoy = new Date();
hoy.setHours(0,0,0,0); // Comparar solo fecha
if (fechaObj > hoy) {
    return res.status(400).json({ 
        success: false, 
        error: "No se puede registrar asistencia para una fecha futura." 
    });
}
*/

// 5. Validar Integridad Referencial (Opcional pero Recomendado)
// Verifica que los IDs existen en sus respectivas tablas antes de intentar el INSERT
// Esto evita errores de "Foreign Key Constraint" genéricos de la BD
try {
    // Verificar Persona
    const [personaResult] = await client.query("SELECT id FROM personas WHERE id = ?", [pId]);
    if (personaResult.length === 0) {
        return res.status(409).json({ success: false, error: "La persona con ID " + pId + " no existe." });
    }

    // Verificar Clase
    const [claseResult] = await client.query("SELECT id FROM clases WHERE id = ?", [cId]);
    if (claseResult.length === 0) {
        return res.status(409).json({ success: false, error: "La clase con ID " + cId + " no existe." });
    }

    // Verificar Sala (si se proporcionó)
    if (sId !== null) {
        const [salaResult] = await client.query("SELECT id FROM salas WHERE id = ?", [sId]);
        if (salaResult.length === 0) {
            return res.status(409).json({ success: false, error: "La sala con ID " + sId + " no existe." });
        }
    }
} catch (dbError) {
    console.error("Error en validación deFK:", dbError);
    return res.status(500).json({ success: false, error: "Error al verificar datos relacionados." });
}

// 6. Validación de Duplicados (Preventiva)
// Evita que el mismo usuario tenga dos asistencias en la misma clase el mismo día
const [duplicado] = await client.query(
    "SELECT id FROM asistencias WHERE personaid = ? AND claseid = ? AND DATE(fecha) = ?",
    [pId, cId, fechaObj] // DATE(fecha) funciona en MySQL/PostgreSQL
);

if (duplicado.length > 0) {
    return res.status(409).json({ 
        success: false, 
        error: "Ya existe un registro de asistencia para esta persona y clase en esta fecha." 
    });
}


await client.query("INSERT INTO asistencias ...", [pId, cId, sId, fechaObj]);