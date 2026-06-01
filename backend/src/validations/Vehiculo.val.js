// ... dentro de tu función createVehiculo(req, res)

const { matricula, tipo, modelo, marca, disponible } = req.body;

// 1. Validar campos requeridos
if (!matricula || !tipo || !modelo || !marca || disponible === undefined) {
    return res.status(400).json({ 
        success: false, 
        error: "Todos los campos son obligatorios: matricula, tipo, modelo, marca, disponible." 
    });
}

// 2. Normalizar y validar 'matricula' (Clave Primaria)
const matriculaNorm = matricula.trim().toUpperCase();

// Validar longitud mínima y máxima (Ajusta según el estándar de tu país, ej: 7-10 chars)
if (matriculaNorm.length < 5 || matriculaNorm.length > 12) {
    return res.status(400).json({ 
        success: false, 
        error: "La matrícula debe tener entre 5 y 12 caracteres." 
    });
}

// Validar formato (Letras y números, sin caracteres especiales excepto guion si lo usas)
// Ejemplo regex: permite letras, números y guion. Ajusta si tu país usa solo números o letras específicas.
const matriculaRegex = /^[A-Z0-9\-]+$/;
if (!matriculaRegex.test(matriculaNorm)) {
    return res.status(400).json({ 
        success: false, 
        error: "Formato de matrícula inválido. Solo se permiten letras, números y guiones." 
    });
}

// 3. Validar 'tipo', 'modelo', 'marca' (Strings)
const camposTexto = [
    { nombre: 'tipo', valor: tipo, max: 30 },
    { nombre: 'modelo', valor: modelo, max: 30 },
    { nombre: 'marca', valor: marca, max: 30 }
];

for (const campo of camposTexto) {
    if (typeof campo.valor !== 'string') {
        return res.status(400).json({ success: false, error: `El campo '${campo.nombre}' debe ser texto.` });
    }

    const valorTrimmed = campo.valor.trim();
    if (valorTrimmed.length === 0) {
        return res.status(400).json({ success: false, error: `El campo '${campo.nombre}' no puede estar vacío.` });
    }

    if (valorTrimmed.length > campo.max) {
        return res.status(400).json({ 
            success: false, 
            error: `El campo '${campo.nombre}' no puede exceder ${campo.max} caracteres.` 
        });
    }
}

// Normalizar los valores de texto
const tipoNorm = tipo.trim();
const modeloNorm = modelo.trim();
const marcaNorm = marca.trim();

// 4. Validar 'disponible' (Booleano)
let esDisponible;
if (typeof disponible === 'boolean') {
    esDisponible = disponible;
} else if (typeof disponible === 'string') {
    esDisponible = disponible.toLowerCase() === 'true' || disponible === '1';
} else if (typeof disponible === 'number') {
    esDisponible = disponible === 1;
} else {
    return res.status(400).json({ 
        success: false, 
        error: "El campo 'disponible' debe ser un valor booleano (true/false, 1/0)." 
    });
}

// 5. Verificar Unicidad de la Matrícula (Preventivo)
// Como la matrícula es la PK, la BD lo impedirá, pero es mejor dar un error 409 claro.
try {
    const [check] = await client.query("SELECT matricula FROM Vehiculos WHERE matricula = ?", [matriculaNorm]);
    if (check.length > 0) {
        return res.status(409).json({ 
            success: false, 
            error: "Ya existe un vehículo registrado con esta matrícula." 
        });
    }
} catch (dbError) {
    console.error("Error al verificar matrícula:", dbError);
    return res.status(500).json({ success: false, error: "Error al verificar existencia del vehículo." });
}

// ... AQUÍ VA TU CÓDIGO DE INSERT ACTUAL ...
// await client.query(
//     "INSERT INTO Vehiculos (matricula, tipo, modelo, marca, disponible) VALUES (?, ?, ?, ?, ?)",
//     [matriculaNorm, tipoNorm, modeloNorm, marcaNorm, esDisponible]
// );