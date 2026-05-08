"use strict";

import Joi from "joi";

export const registerSchema = Joi.object({
    correo: Joi.string().email().required().messages({
        "string.email": "El correo debe ser válido",
        "any.required": "El correo es obligatorio"
    }),
    password: Joi.string().min(6).required().messages({
        "string.min": "La contraseña debe tener al menos 6 caracteres",
        "any.required": "La contraseña es obligatoria"
    }),
    nombrecompleto: Joi.string().required().messages({
        "any.required": "El nombre completo es obligatorio"
    }),
    rut: Joi.string().required().messages({
        "any.required": "El RUT es obligatorio"
    }),
    rol: Joi.string().required().messages({
        "any.required": "El rol es obligatorio"
    }),
    direccion: Joi.string().required().messages({
        "any.required": "La dirección es obligatoria"
    }),
    localidad: Joi.string().required().messages({
        "any.required": "La localidad es obligatoria"
    }),
    edad: Joi.number().required().messages({
        "any.required": "La edad es obligatoria"
    })
});

export const loginSchema = Joi.object({
    correo: Joi.string().email().required().messages({
        "string.email": "El correo debe ser válido",
        "any.required": "El correo es obligatorio"
    }),
    password: Joi.string().required().messages({
        "any.required": "La contraseña es obligatoria"
    })
});