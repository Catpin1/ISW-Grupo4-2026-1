"use strict";

import { AppDataSource } from "../config/configDb.js";
import { sendErrorClient, sendSuccess, sendErrorServer } from "../handlers/ResponseHandlers.js";

const planRepository = AppDataSource.getRepository("Plan");

const validarId = (id) => {
    const idNumerico = Number(id);
    return Number.isInteger(idNumerico) && idNumerico > 0 ? idNumerico : null;
};

const validarDatosPlan = ({ id, nombre, precio, descripcion }, requiereId = false) => {
    if (requiereId && validarId(id) === null) {
        return "El id del plan debe ser un numero entero positivo.";
    }

    if (nombre !== undefined && (typeof nombre !== "string" || nombre.trim() === "")) {
        return "El nombre del plan es obligatorio y debe ser texto.";
    }

    if (precio !== undefined) {
        const precioNumerico = Number(precio);
        if (!Number.isInteger(precioNumerico) || precioNumerico < 0) {
            return "El precio debe ser un numero entero no negativo.";
        }
    }

    if (descripcion !== undefined && (typeof descripcion !== "string" || descripcion.trim() === "")) {
        return "La descripcion del plan es obligatoria y debe ser texto.";
    }

    if (nombre !== undefined && nombre.trim().length > 100) {
        return "El nombre no puede exceder los 100 caracteres.";
    }

    if (descripcion !== undefined && descripcion.trim().length > 500) {
        return "La descripcion no puede exceder los 500 caracteres.";
    }

    return null;
};

export const getAllPlanes = async (req, res) => {
    try {
        const planes = await planRepository.find({
            order: {
                precio: "ASC",
            },
        });

        return sendSuccess(res, planes, "Planes obtenidos correctamente");
    } catch (error) {
        return sendErrorServer(res, error, 500);
    }
};

export const getPlanById = async (req, res) => {
    try {
        const id = validarId(req.params.id);

        if (id === null) {
            return sendErrorClient(res, new Error("ID invalido."), 400);
        }

        const plan = await planRepository.findOneBy({ id });

        if (!plan) {
            return res.status(404).json({ message: "Plan no encontrado" });
        }

        return sendSuccess(res, plan, "Plan obtenido correctamente");
    } catch (error) {
        return sendErrorServer(res, error, 500);
    }
};

export const createPlan = async (req, res) => {
    try {
        const { nombre, precio, descripcion } = req.body;
        const errorValidacion = validarDatosPlan(req.body);

        if (errorValidacion) {
            return sendErrorClient(res, new Error(errorValidacion), 400);
        }

        if (nombre === undefined || precio === undefined || descripcion === undefined) {
            return sendErrorClient(res, new Error("Los campos nombre, precio y descripcion son obligatorios."), 400);
        }

        const planExistente = await planRepository.findOneBy({ nombre: nombre.trim() });

        if (planExistente) {
            return sendErrorClient(res, new Error("Ya existe un plan con ese nombre."), 409);
        }

        const nuevoPlan = planRepository.create({
            nombre: nombre.trim(),
            precio: Number(precio),
            descripcion: descripcion.trim(),
        });

        const resultado = await planRepository.save(nuevoPlan);

        return sendSuccess(res, resultado, "Plan creado correctamente", 201);
    } catch (error) {
        return sendErrorServer(res, error, 500);
    }
};

export const updatePlan = async (req, res) => {
    try {
        const id = validarId(req.params.id);

        if (id === null) {
            return sendErrorClient(res, new Error("ID invalido."), 400);
        }

        const { nombre, precio, descripcion } = req.body;

        if (nombre === undefined && precio === undefined && descripcion === undefined) {
            return sendErrorClient(res, new Error("No hay datos para actualizar."), 400);
        }

        const errorValidacion = validarDatosPlan(req.body);

        if (errorValidacion) {
            return sendErrorClient(res, new Error(errorValidacion), 400);
        }

        const plan = await planRepository.findOneBy({ id });

        if (!plan) {
            return res.status(404).json({ message: "Plan no encontrado" });
        }

        planRepository.merge(plan, {
            ...(nombre !== undefined && { nombre: nombre.trim() }),
            ...(precio !== undefined && { precio: Number(precio) }),
            ...(descripcion !== undefined && { descripcion: descripcion.trim() }),
        });

        const resultado = await planRepository.save(plan);

        return sendSuccess(res, resultado, "Plan actualizado correctamente");
    } catch (error) {
        return sendErrorServer(res, error, 500);
    }
};

export const deletePlan = async (req, res) => {
    try {
        const id = validarId(req.params.id);

        if (id === null) {
            return sendErrorClient(res, new Error("ID invalido."), 400);
        }

        const plan = await planRepository.findOneBy({ id });

        if (!plan) {
            return res.status(404).json({ message: "Plan no encontrado" });
        }

        await planRepository.remove(plan);

        return sendSuccess(res, plan, "Plan eliminado correctamente");
    } catch (error) {
        if (error.code === "23503") {
            return sendErrorClient(res, new Error("No se puede eliminar el plan porque esta asociado a compras."), 400);
        }

        return sendErrorServer(res, error, 500);
    }
};
