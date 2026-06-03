"use strict";

import { AppDataSource } from "../config/configDb.js";
import { compraCreateSchema, compraUpdateSchema } from "../validations/Compra.val.js";
import { sendErrorClient, sendSuccess, sendErrorServer } from "../handlers/ResponseHandlers.js";

const compraRepository = AppDataSource.getRepository("Compra");
const personaRepository = AppDataSource.getRepository("Persona");
const planRepository = AppDataSource.getRepository("Plan");

export const createCompra = async (req, res) => {
    try {
        const { error, value } = compraCreateSchema.validate(req.body);
        if (error) {
            return sendErrorClient(res, error, 400);
        }

        const { id_persona, id_plan, descripcion, monto, comprobante } = value;

        const persona = await personaRepository.findOneBy({ id: id_persona });

        if (!persona) {
            return res.status(404).json({ message: "Usuario no encontrado para asociar la compra" });
        }

        const plan = await planRepository.findOneBy({ id: id_plan });

        if (!plan) {
            return res.status(404).json({ message: "Plan no encontrado para asociar la compra" });
        }

        const nuevaCompra = compraRepository.create({
            descripcion,
            monto,
            estado_pago: "Pendiente de validacion",
            comprobante,
            persona: { id: id_persona },
            plan: { id: id_plan }
        });

        const resultado = await compraRepository.save(nuevaCompra);

        return sendSuccess(res, resultado, "Compra registrada correctamente", 201);
    } catch (error) {
        return sendErrorServer(res, error, 500);
    }
};

export const getCompras = async (req, res) => {
    try {
        const compras = await compraRepository.find({
            relations: {
                persona: true,
                plan: true,
            },
            order: {
                fecha: "DESC",
            },
        });

        return res.json(compras);
    } catch (error) {
        return sendErrorServer(res, error, 500);
    }
};

export const getCompra = async (req, res) => {
    try {
        const { id } = req.params;

        const compra = await compraRepository.findOne({
            where: { id: parseInt(id) },
            relations: {
                persona: true,
                plan: true,
            },
        });

        if (!compra) {
            return res.status(404).json({ message: "Compra no encontrada" });
        }

        return res.json(compra);
    } catch (error) {
        return sendErrorServer(res, error, 500);
    }
};

export const updateEstadoCompra = async (req, res) => {
    try {
        const { error, value } = compraUpdateSchema.validate(req.body);
        if (error) {
            return sendErrorClient(res, error, 400);
        }

        const { id } = req.params;

        const compra = await compraRepository.findOne({
            where: { id: parseInt(id) },
            relations: {
                persona: true,
            },
        });

        if (!compra) {
            return res.status(404).json({ message: "Compra no encontrada" });
        }

        compraRepository.merge(compra, value);
        const resultado = await compraRepository.save(compra);

        // Si la secretaria aprueba el pago, cambia el rol de la persona a "Alumno"
        if (value.estado_pago === "Aprobado") {
            const persona = compra.persona;

            if (persona && persona.rol === "Usuario") {
                persona.rol = "Alumno";
                await personaRepository.save(persona);
            }
        }

        return res.json(resultado);
    } catch (error) {
        return sendErrorServer(res, error, 500);
    }
};
