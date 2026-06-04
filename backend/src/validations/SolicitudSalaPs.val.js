"use strict";

import Joi from "joi";

export const solicitudsalapsCreateSchema = Joi.object({
    id_persona:Joi.number().integer().positive().required().messages({
        "number.base":"ID de solicitud debe ser un número.",
        "number.integer":"ID de solicitud debe ser entero.",
        "number.positive":"ID de solicitud debe ser positivo.",
        "any.required":"ID de solicitud es requerida."
    }),
    id_sala:Joi.number().integer().positive().required().messages({
        "number.base":"ID de sala debe ser un número.",
        "number.integer":"ID de sala debe ser entero.",
        "number.positive":"ID de sala debe ser positivo.",
        "any.required":"ID de sala es requerida."
    }),
    descripcion:Joi.string().min(4).max(100).required().messages({
        "string.empty":"La descripción no puede ser vacía.",
        "string.base":"La descripcion debe ser tipo string.",
        "string.min":"La descipcion debe ser al menos 4 caracteres de longitud",
        "string.max":"La descripcion debe ser menor a 100 caracteres.",
        "any.required":"La descripcion es obligatoria.",
    }),
    asistentes:Joi.number().integer().positive().required().messages({
        "number.base":"Cantidad de asistentes debe ser un número.",
        "number.integer":"Cantidad de asistentes debe ser entero.",
        "number.positive":"Cantidad de asistentes debe ser positivo",
        "any.required":"Cantidad de asistentes es requerida."
    }),
    estado_solicitud:Joi.string().valid("Pendiente", "Aprobado", "Rechazado").default("Pendiente").required().messages({
        "string.base":"Estado de solicitud debe ser tipo string.",
        "any.only":"Sólo se permite estado 'Pendiente', 'Aprobado' o 'Rechazado'."
    })
}).unknown(false).messages({
    "object.unknown":"No estan permitidos caracteristicas adicionales."
})

export const solicitudsalapsUpdateSchema = Joi.object({
    estado_solicitud:Joi.string().valid("Pendiente", "Aprobado", "Rechazado").required().messages({
        "string.base":"Estado debe ser tipo string",
        "any.only":"Sólo se permite estado 'Pendiente', 'Aprobado' o 'Rechazado'.",
        "any.required":"Estado de solicitud es requerido para actualizar."
    }).unknown(false).messages({
        "object.unknown":"No se permiten características adicionales."
    })
})

