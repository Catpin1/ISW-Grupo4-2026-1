// ... dentro de tu función createEvaluacionPractica(req, res)

const { resultado, numerofaltagrave, numerofaltamedia, numerofaltabaja } = req.body;

// 1. Validar campo obligatorio 'resultado'
if (!resultado || resultado.trim() === '') {
    return res.status(400).json({ 
        success: false, 
        error: "El campo 'resultado' es obligatorio y no puede estar vacío." 
    });
}

// 2. Validar longitud de 'resultado'
if (resultado.length > 30) {
    return res.status(400).json({ 
        success: false, 
        error: "El resultado no puede exceder 30 caracteres." 
    });
}

// 3. Validar y normalizar conteos de faltas
// Si no se envían, asumimos 0 (o null si tu BD lo permite, pero aquí normalizamos a 0)
const faltaGrave = numerofaltagrave !== undefined && numerofaltagrave !== null ? parseInt(numerofaltagrave) : 0;
const faltaMedia = numerofaltamedia !== undefined && numerofaltamedia !== null ? parseInt(numerofaltamedia) : 0;
const faltaBaja = numerofaltabaja !== undefined && numerofaltabaja !== null ? parseInt(numerofaltabaja) : 0;

// Validar que sean números enteros
if (isNaN(faltaGrave) || isNaN(faltaMedia) || isNaN(faltaBaja)) {
    return res.status(400).json({ 
        success: false, 
        error: "Los conteos de faltas (grave, media, baja) deben ser números enteros válidos." 
    });
}

// 4. Validar que no sean negativos
if (faltaGrave < 0 || faltaMedia < 0 || faltaBaja < 0) {
    return res.status(400).json({ 
        success: false, 
        error: "El número de faltas no puede ser negativo." 
    });
}

