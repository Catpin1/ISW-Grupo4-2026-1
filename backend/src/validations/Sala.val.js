// ... dentro de tu función createSala(req, res)

const { tipo, cantidadmaxima, disponible } = req.body;

// 1. Validar campos requeridos
if (!tipo || cantidadmaxima === undefined || disponible === undefined) {
    return res.status(400).json({ 
        success: false, 
        error: "Los campos 'tipo', 'cantidadmaxima' y 'disponible' son obligatorios." 
    });
}

// 2. Validar 'tipo' (String)
if (typeof tipo !== 'string') {
    return res.status(400).json({ 
        success: false, 
        error: "El campo 'tipo' debe ser texto." 
    });
}

const tipoTrimmed = tipo.trim();
if (tipoTrimmed.length === 0) {
    return res.status(400).json({ 
        success: false, 
        error: "El tipo de sala no puede estar vacío." 
    });
}

if (tipoTrimmed.length > 30) {
    return res.status(400).json({ 
        success: false, 
        error: "El tipo de sala no puede exceder los 30 caracteres." 
    });
}

// 3. Validar 'cantidadmaxima' (Entero positivo)
const capacidadNum = parseInt(cantidadmaxima);

if (isNaN(capacidadNum)) {
    return res.status(400).json({ 
        success: false, 
        error: "La capacidad máxima debe ser un número entero válido." 
    });
}

if (capacidadNum <= 0) {
    return res.status(400).json({ 
        success: false, 
        error: "La capacidad máxima debe ser un número entero mayor a 0." 
    });
}

// Opcional: Límite superior razonable (ej: no más de 500 personas en una sala)
if (capacidadNum > 500) {
    return res.status(400).json({ 
        success: false, 
        error: "La capacidad máxima no puede superar 500 personas por razones de seguridad/logística." 
    });
}

// 4. Validar 'disponible' (Booleano)
let esDisponible;
if (typeof disponible === 'boolean') {
    esDisponible = disponible;
} else if (typeof disponible === 'string') {
    // Permitir "true", "false", "1", "0" como strings
    esDisponible = disponible.toLowerCase() === 'true' || disponible === '1';
} else if (typeof disponible === 'number') {
    // Permitir 1 o 0 como números
    esDisponible = disponible === 1;
} else {
    return res.status(400).json({ 
        success: false, 
        error: "El campo 'disponible' debe ser un valor booleano (true/false, 1/0)." 
    });
}

// ... AQUÍ VA TU CÓDIGO DE INSERT ACTUAL ...
// await client.query(
//     "INSERT INTO salas (tipo, cantidadmaxima, disponible) VALUES (?, ?, ?)",
//     [tipoTrimmed, capacidadNum, esDisponible]
// );