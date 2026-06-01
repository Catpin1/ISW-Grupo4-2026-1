// ... dentro de tu función createPlan(req, res)

const { precio, descripcion } = req.body;

// 1. Validar campos requeridos
if (precio === undefined || descripcion === undefined) {
    return res.status(400).json({ 
        success: false, 
        error: "Los campos 'precio' y 'descripcion' son obligatorios." 
    });
}

// 2. Validar y parsear el precio
const precioNum = parseInt(precio);

// Verificar que sea un número entero válido
if (isNaN(precioNum)) {
    return res.status(400).json({ 
        success: false, 
        error: "El precio debe ser un número entero válido." 
    });
}

// Verificar que no sea negativo (no tiene sentido un precio negativo)
if (precioNum < 0) {
    return res.status(400).json({ 
        success: false, 
        error: "El precio no puede ser un valor negativo." 
    });
}

// Opcional: Verificar que no sea 0 (dependiendo de tu negocio, quizás los planes sean siempre de pago)
// if (precioNum === 0) {
//     return res.status(400).json({ success: false, error: "El precio debe ser mayor a 0." });
// }

// 3. Validar la descripción
if (typeof descripcion !== 'string') {
    return res.status(400).json({ 
        success: false, 
        error: "La descripción debe ser texto." 
    });
}

const descripcionTrimmed = descripcion.trim();

// Verificar que no esté vacía
if (descripcionTrimmed.length === 0) {
    return res.status(400).json({ 
        success: false, 
        error: "La descripción no puede estar vacía." 
    });
}

// Verificar longitud máxima (500 caracteres según tu esquema)
if (descripcionTrimmed.length > 500) {
    return res.status(400).json({ 
        success: false, 
        error: "La descripción no puede exceder los 500 caracteres." 
    });
}

