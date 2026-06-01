// ... dentro de tu función createEvaluacionTeorica(req, res)

const { nota, puntajetotal } = req.body;

// 1. Validar campos requeridos
if (nota === undefined || puntajetotal === undefined) {
    return res.status(400).json({ 
        success: false, 
        error: "Los campos 'nota' y 'puntajetotal' son obligatorios." 
    });
}

// 2. Parsear y validar tipos de datos
const notaNum = parseFloat(nota);
const totalNum = parseInt(puntajetotal);

if (isNaN(notaNum)) {
    return res.status(400).json({ 
        success: false, 
        error: "El campo 'nota' debe ser un número decimal (float)." 
    });
}

if (isNaN(totalNum) || !Number.isInteger(totalNum)) {
    return res.status(400).json({ 
        success: false, 
        error: "El campo 'puntajetotal' debe ser un número entero (int)." 
    });
}

// 3. Validar rangos lógicos
// La nota no puede ser negativa
if (notaNum < 0) {
    return res.status(400).json({ 
        success: false, 
        error: "La nota no puede ser un valor negativo." 
    });
}

// El puntaje total debe ser positivo (no tiene sentido un total de 0 o negativo)
if (totalNum <= 0) {
    return res.status(400).json({ 
        success: false, 
        error: "El puntaje total debe ser un número entero positivo (mayor a 0)." 
    });
}

// 4. Validación de Consistencia (Crítica)
// La nota no puede ser mayor que el puntaje total
if (notaNum > totalNum) {
    return res.status(400).json({ 
        success: false, 
        error: `La nota (${notaNum}) no puede ser mayor que el puntaje total (${totalNum}).` 
    });
}

// 5. Validación opcional: Precisión decimal
// Si tu sistema no acepta más de 1 o 2 decimales, puedes limitarlo aquí
// Ejemplo: Máximo 2 decimales
const decimales = (notaNum.toString().split('.') || '').length;
if (decimales > 2) {
    return res.status(400).json({ 
        success: false, 
        error: "La nota no puede tener más de 2 decimales." 
    });
}


await client.query(
    "INSERT INTO evaluaciones_teoricas (nota, puntajetotal) VALUES (?, ?)",
    [notaNum, totalNum]
 );