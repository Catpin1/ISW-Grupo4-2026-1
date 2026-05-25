"use strict";

import Joi from "joi";

const domainEmailValidator = (value, helper) => {
    if (!value.endsWith("@gmail.cl") && !value.endsWith("@gmail.com")) {
        return helper.message(
            "El correo electrónico debe ser del dominio @gmail.cl o @gmail.com"
        );
    }
    return value;
};

export const personaCreateSchema = Joi.object({
    correo: Joi.string()
        .min(10)
        .max(100)
        .email()
        .required()
        .messages({
            "string.empty": "El correo electrónico no puede estar vacío.",
            "string.base": "El correo electrónico debe ser de tipo string.",
            "string.email": "El correo electrónico debe ser válido.",
            "string.min": "El correo electrónico debe tener como mínimo 10 caracteres.",
            "string.max": "El correo electrónico debe tener como máximo 100 caracteres.",
            "any.required": "El correo electrónico es obligatorio."
        })
        .custom(domainEmailValidator, "Validación dominio email"),

    password: Joi.string()
        .min(8)
        .max(26)
        .pattern(/^[a-zA-Z0-9]+$/)
        .required()
        .messages({
            "string.empty": "La contraseña no puede estar vacía.",
            "string.base": "La contraseña debe ser de tipo string.",
            "string.min": "La contraseña debe tener como mínimo 8 caracteres.",
            "string.max": "La contraseña debe tener como máximo 26 caracteres.",
            "string.pattern.base": "La contraseña solo puede contener letras y números.",
            "any.required": "La contraseña es obligatoria."
        }),

    nombrecompleto: Joi.string()
        .min(10)
        .max(100)
        .pattern(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/)
        .required()
        .messages({
            "string.empty": "El nombre completo no puede estar vacío.",
            "string.base": "El nombre completo debe ser de tipo string.",
            "string.min": "El nombre completo debe tener como mínimo 10 caracteres.",
            "string.max": "El nombre completo debe tener como máximo 100 caracteres.",
            "string.pattern.base": "El nombre completo solo puede contener letras y espacios.",
            "any.required": "El nombre completo es obligatorio."
        }),

    rut: Joi.string()
        .min(9)
        .max(12)
        .pattern(/^(?:(?:[1-9]\d{0}|[1-2]\d{1})(\.\d{3}){2}|[1-9]\d{6}|[1-2]\d{7}|29\.999\.999|29999999)-[\dkK]$/)
        .required()
        .messages({
            "string.empty": "El rut no puede estar vacío.",
            "string.base": "El rut debe ser de tipo string.",
            "string.min": "El rut debe tener como mínimo 9 caracteres.",
            "string.max": "El rut debe tener como máximo 12 caracteres.",
            "string.pattern.base": "Formato rut inválido, debe ser xx.xxx.xxx-x o xxxxxxxx-x.",
            "any.required": "El rut es obligatorio."
        }),

    rol: Joi.string()
        .min(4)
        .max(13)
        .required()
        .messages({
            "string.empty": "El rol no puede estar vacío.",
            "string.base": "El rol debe ser de tipo string.",
            "string.min": "El rol debe tener como mínimo 4 caracteres.",
            "string.max": "El rol debe tener como máximo 13 caracteres.",
            "any.required": "El rol es obligatorio."
        }),

    direccion: Joi.string()
        .min(5)
        .max(100)
        .required()
        .messages({
            "string.empty": "La dirección no puede estar vacía.",
            "string.base": "La dirección debe ser de tipo string.",
            "string.min": "La dirección debe tener como mínimo 5 caracteres.",
            "string.max": "La dirección debe tener como máximo 100 caracteres.",
            "any.required": "La dirección es obligatoria."
        }),

    localidad: Joi.string()
        .min(3)
        .max(100)
        .required()
        .messages({
            "string.empty": "La localidad no puede estar vacía.",
            "string.base": "La localidad debe ser de tipo string.",
            "string.min": "La localidad debe tener como mínimo 3 caracteres.",
            "string.max": "La localidad debe tener como máximo 100 caracteres.",
            "any.required": "La localidad es obligatoria."
        }),

    edad: Joi.number()
        .integer()
        .positive()
        .min(18)
        .required()
        .messages({
            "number.base": "La edad debe ser un número.",
            "number.integer": "La edad debe ser un número entero.",
            "number.positive": "La edad debe ser un número positivo.",
            "number.min": "La edad debe ser de al menos 18 años.",
            "any.required": "La edad es obligatoria."
        })
}).unknown(false).messages({
    "object.unknown": "No se permiten propiedades adicionales."
});

export const personaUpdateSchema = Joi.object({
    correo: Joi.string()
        .min(10)
        .max(100)
        .email()
        .messages({
            "string.empty": "El correo electrónico no puede estar vacío.",
            "string.base": "El correo electrónico debe ser de tipo string.",
            "string.email": "El correo electrónico debe ser válido.",
            "string.min": "El correo electrónico debe tener como mínimo 10 caracteres.",
            "string.max": "El correo electrónico debe tener como máximo 100 caracteres."
        })
        .custom(domainEmailValidator, "Validación dominio email"),

    password: Joi.string()
        .min(8)
        .max(26)
        .pattern(/^[a-zA-Z0-9]+$/)
        .messages({
            "string.empty": "La contraseña no puede estar vacía.",
            "string.base": "La contraseña debe ser de tipo string.",
            "string.min": "La contraseña debe tener como mínimo 8 caracteres.",
            "string.max": "La contraseña debe tener como máximo 26 caracteres.",
            "string.pattern.base": "La contraseña solo puede contener letras y números."
        }),

    nombrecompleto: Joi.string()
        .min(10)
        .max(100)
        .pattern(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/)
        .messages({
            "string.empty": "El nombre completo no puede estar vacío.",
            "string.base": "El nombre completo debe ser de tipo string.",
            "string.min": "El nombre completo debe tener como mínimo 10 caracteres.",
            "string.max": "El nombre completo debe tener como máximo 100 caracteres.",
            "string.pattern.base": "El nombre completo solo puede contener letras y espacios."
        }),

    rut: Joi.string()
        .min(9)
        .max(12)
        .pattern(/^(?:(?:[1-9]\d{0}|[1-2]\d{1})(\.\d{3}){2}|[1-9]\d{6}|[1-2]\d{7}|29\.999\.999|29999999)-[\dkK]$/)
        .messages({
            "string.empty": "El rut no puede estar vacío.",
            "string.base": "El rut debe ser de tipo string.",
            "string.min": "El rut debe tener como mínimo 9 caracteres.",
            "string.max": "El rut debe tener como máximo 12 caracteres.",
            "string.pattern.base": "Formato rut inválido, debe ser xx.xxx.xxx-x o xxxxxxxx-x."
        }),

    rol: Joi.string()
        .min(4)
        .max(13)
        .messages({
            "string.empty": "El rol no puede estar vacío.",
            "string.base": "El rol debe ser de tipo string.",
            "string.min": "El rol debe tener como mínimo 4 caracteres.",
            "string.max": "El rol debe tener como máximo 13 caracteres."
        }),

    direccion: Joi.string()
        .min(5)
        .max(100)
        .messages({
            "string.empty": "La dirección no puede estar vacía.",
            "string.base": "La dirección debe ser de tipo string.",
            "string.min": "La dirección debe tener como mínimo 5 caracteres.",
            "string.max": "La dirección debe tener como máximo 100 caracteres."
        }),

    localidad: Joi.string()
        .min(3)
        .max(100)
        .messages({
            "string.empty": "La localidad no puede estar vacía.",
            "string.base": "La localidad debe ser de tipo string.",
            "string.min": "La localidad debe tener como mínimo 3 caracteres.",
            "string.max": "La localidad debe tener como máximo 100 caracteres."
        }),

    edad: Joi.number()
        .integer()
        .positive()
        .min(18)
        .messages({
            "number.base": "La edad debe ser un número.",
            "number.integer": "La edad debe ser un número entero.",
            "number.positive": "La edad debe ser un número positivo.",
            "number.min": "La edad debe ser de al menos 18 años."
        })
}).or("correo", "password", "nombrecompleto", "rut", "rol", "direccion", "localidad", "edad")
    .unknown(false)
    .messages({
        "object.unknown": "No se permiten propiedades adicionales.",
        "object.missing": "Debes proporcionar al menos un campo para actualizar."
    });
