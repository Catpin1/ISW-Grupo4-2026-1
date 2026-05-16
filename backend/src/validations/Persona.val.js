// ... dentro de tu función createPersona(req, res)

const { rut, correo, password, nombrecompleto, rol, direccion, localidad, edad } = req.body;

// 1. Validar campos requeridos básicos
if (!rut || !correo || !password || !nombrecompleto || !rol || !direccion || !localidad || edad === undefined) {
    return res.status(400).json({ 
        success: false, 
        error: "Todos los campos son obligatorios: rut, correo, password, nombrecompleto, rol, direccion, localidad, edad." 
    });
}

// 2. Validar RUT (Chileno o genérico)
// Nota: Si necesitas validación estricta del dígito verificador, se requiere una función de algoritmo.
// Aquí validamos formato básico: números y un guion opcional, máximo 20 chars.
const rutLimpiado = rut.replace(/\./g, '').replace('-', '').toUpperCase(); // Normalizar
if (rutLimpiado.length < 5 || rutLimpiado.length > 12) { // Ajustar según tu país (ej: Chile suele ser 8-9 chars + DV)
    return res.status(400).json({ 
        success: false, 
        error: "El RUT tiene un formato inválido (muy corto o muy largo)." 
    });
}
// Opcional: Validar que la longitud coincida con el estándar de tu país
// Ejemplo Chile: 8 dígitos + guion + 1 DV = 10 chars aprox.
if (!/^[0-9Kk]{1,9}-[0-9Kk]{1}$/.test(rut)) {
    return res.status(400).json({ 
        success: false, 
        error: "Formato de RUT inválido. Debe ser como: 12345678-9 o 12.345.678-9." 
    });
}

// 3. Validar Correo
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
if (!emailRegex.test(correo)) {
    return res.status(400).json({ 
        success: false, 
        error: "El correo electrónico tiene un formato inválido." 
    });
}
if (correo.length > 100) {
    return res.status(400).json({ 
        success: false, 
        error: "El correo excede los 100 caracteres." 
    });
}

// 4. Validar Contraseña (Seguridad)
if (password.length < 6) {
    return res.status(400).json({ 
        success: false, 
        error: "La contraseña debe tener al menos 6 caracteres." 
    });
}
// Opcional: Exigir mayúscula, número o especial
// if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(password)) { ... }

// 5. Validar Nombre Completo
if (nombrecompleto.trim().length < 3 || nombrecompleto.trim().length > 100) {
    return res.status(400).json({ 
        success: false, 
        error: "El nombre completo debe tener entre 3 y 100 caracteres." 
    });
}

// 6. Validar Rol
const rolesPermitidos = ['admin', 'instructor', 'alumno', 'secretario']; // Ajusta según tu sistema
if (!rolesPermitidos.includes(rol.toLowerCase())) {
    return res.status(400).json({ 
        success: false, 
        error: `Rol inválido. Los valores permitidos son: ${rolesPermitidos.join(', ')}.` 
    });
}
if (rol.length > 13) {
    return res.status(400).json({ 
        success: false, 
        error: "El rol excede los 13 caracteres." 
    });
}

// 7. Validar Direcciones y Localidad
if (direccion.length > 100 || direccion.trim().length === 0) {
    return res.status(400).json({ 
        success: false, 
        error: "La dirección debe tener entre 1 y 100 caracteres." 
    });
}
if (localidad.length > 100 || localidad.trim().length === 0) {
    return res.status(400).json({ 
        success: false, 
        error: "La localidad debe tener entre 1 y 100 caracteres." 
    });
}

// 8. Validar Edad
const edadNum = parseInt(edad);
if (isNaN(edadNum) || edadNum < 0 || edadNum > 120) {
    return res.status(400).json({ 
        success: false, 
        error: "La edad debe ser un número entero entre 0 y 120." 
    });
}

// 9. Verificar Unicidad (RUT y Correo)
// Esto es vital porque la BD tiene restricciones UNIQUE, pero es mejor fallar antes con un mensaje claro.
try {
    // Verificar RUT
    const [rutCheck] = await client.query("SELECT id FROM personas WHERE rut = ?", [rutLimpiado]);
    if (rutCheck.length > 0) {
        return res.status(409).json({ 
            success: false, 
            error: "Ya existe una persona registrada con este RUT." 
        });
    }

    // Verificar Correo
    const [correoCheck] = await client.query("SELECT id FROM personas WHERE correo = ?", [correo.toLowerCase()]);
    if (correoCheck.length > 0) {
        return res.status(409).json({ 
            success: false, 
            error: "Ya existe una persona registrada con este correo electrónico." 
        });
    }
} catch (dbError) {
    console.error("Error en verificación de unicidad:", dbError);
    return res.status(500).json({ success: false, error: "Error al verificar datos existentes." });
}

// 10. Hash de Contraseña (CRÍTICO)
// NUNCA guardes la contraseña en texto plano.
// Asegúrate de tener instalado 'bcrypt' o similar: npm install bcrypt
const bcrypt = require('bcrypt');
const saltRounds = 10;
const passwordHash = await bcrypt.hash(password, saltRounds);


 await client.query(
   "INSERT INTO personas (rut, correo, password, nombrecompleto, rol, direccion, localidad, edad) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
    [rutLimpiado, correo.toLowerCase(), passwordHash, nombrecompleto.trim(), rol.toLowerCase(), direccion.trim(), localidad.trim(), edadNum]
 );
