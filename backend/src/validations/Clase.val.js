// ... dentro de tu función createClase(req, res)

const { modalidad, horainicio, horatermino } = req.body;

// 1. Validar campos requeridos
if (!modalidad || !horainicio || !horatermino) {
    return res.status(400).json({ 
        success: false, 
        error: "Los campos modalidad, horainicio y horatermino son obligatorios." 
    });
}

// 2. Validar longitud de modalidad
if (modalidad.length > 30) {
    return res.status(400).json({ 
        success: false, 
        error: "La modalidad no puede exceder 30 caracteres." 
    });
}

// 3. Validar y parsear fechas
const inicioDate = new Date(horainicio);
const terminoDate = new Date(horatermino);

if (isNaN(inicioDate.getTime()) || isNaN(terminoDate.getTime())) {
    return res.status(400).json({ 
        success: false, 
        error: "Formato de fecha inválido. Usa ISO 8601 (ej: 2026-05-16T08:00:00)." 
    });
}

// 4. Validación Lógica: El término debe ser estrictamente mayor al inicio
if (terminoDate <= inicioDate) {
    return res.status(400).json({ 
        success: false, 
        error: "La hora de término debe ser posterior a la hora de inicio." 
    });
}

// 5. Validación de Duración Mínima/Máxima (Opcional)
// Ejemplo: Una clase no puede durar menos de 30 minutos ni más de 4 horas
const duracionMin = 30 * 60 * 1000; // 30 minutos en ms
const duracionMax = 4 * 60 * 60 * 1000; // 4 horas en ms
const duracion = terminoDate.getTime() - inicioDate.getTime();

if (duracion < duracionMin) {
    return res.status(400).json({ 
        success: false, 
        error: `La clase debe durar al menos ${duracionMin / (60 * 1000)} minutos.` 
    });
}
if (duracion > duracionMax) {
    return res.status(400).json({ 
        success: false, 
        error: `La clase no puede durar más de ${duracionMax / (60 * 1000)} horas.` 
    });
}

