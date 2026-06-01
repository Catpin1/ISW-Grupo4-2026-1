"use strict";

import Joi from "joi";

export const compraCreateSchema = Joi.object({
    id_persona: Joi.number().integer().positive().required().messages({
        "number.base": "El id_persona debe ser un número.",
        "number.integer": "El id_persona debe ser un número entero.",
        "number.positive": "El id_persona debe ser un número positivo.",
        "any.required": "El id_persona es obligatorio."
    }),
    descripcion: Joi.string().min(5).max(255).required().messages({
        "string.empty": "La descripción no puede estar vacía.",
        "string.base": "La descripción debe ser de tipo string.",
        "string.min": "La descripción debe tener como mínimo 5 caracteres.",
        "string.max": "La descripción debe tener como máximo 255 caracteres.",
        "any.required": "La descripción es obligatoria."
    }),
    monto: Joi.number().integer().positive().required().messages({
        "number.base": "El monto debe ser un número.",
        "number.integer": "El monto debe ser un número entero.",
        "number.positive": "El monto debe ser un número positivo.",
        "any.required": "El monto es obligatorio."
    }),
    estado_pago: Joi.string().valid("Pendiente", "Aprobado", "Rechazado").default("Pendiente").messages({
        "string.base": "El estado de pago debe ser de tipo string.",
        "any.only": "El estado de pago debe ser 'Pendiente', 'Aprobado' o 'Rechazado'."
    })
}).unknown(false).messages({
    "object.unknown": "No se permiten propiedades adicionales."
});

export const compraUpdateSchema = Joi.object({
    estado_pago: Joi.string().valid("Pendiente", "Aprobado", "Rechazado").required().messages({
        "string.base": "El estado de pago debe ser de tipo string.",
        "any.only": "El estado de pago debe ser 'Pendiente', 'Aprobado' o 'Rechazado'.",
        "any.required": "El estado_pago es obligatorio para actualizar."
    })
}).unknown(false).messages({
    "object.unknown": "Solo se permite actualizar el estado_pago."
});
