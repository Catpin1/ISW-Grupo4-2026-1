"use strict";

import { AppDataSource } from "../config/configDb.js";
import { compraCreateSchema, compraUpdateSchema } from "../validations/Compra.val.js";
import { sendErrorClient, sendSuccess, sendErrorServer } from "../handlers/ResponseHandlers.js";

const compraRepository = AppDataSource.getRepository("Compra");
const personaRepository = AppDataSource.getRepository("Persona");

export const createCompra = async (req, res) => {
    try {
        const { error } = compraCreateSchema.validate(req.body);
        if (error) {
            return sendErrorClient(res, error, 400);
        }

        const { id_persona } = req.body;
        const persona = await personaRepository.findOneBy({ id: id_persona });
        
        if (!persona) {
            return res.status(404).json({ message: "Usuario no encontrado para asociar la compra" });
        }

        const nuevaCompra = compraRepository.create({
            descripcion: req.body.descripcion,
            monto: req.body.monto,
            estado_pago: req.body.estado_pago,
            persona: { id: id_persona }
        });
        const resultado = await compraRepository.save(nuevaCompra);

        return sendSuccess(res, resultado, "Compra registrada correctamente", 201);
    } catch (error) {
        return sendErrorServer(res, error, 500);
    }
};

export const getCompras = async (req, res) => {
    try {
        const compras = await compraRepository.find();
        return res.json(compras);
    } catch (error) {
        return sendErrorServer(res, error, 500);
    }
};

export const getCompra = async (req, res) => {
    try {
        const { id } = req.params;
        const compra = await compraRepository.findOneBy({ id: parseInt(id) });

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
        const { error } = compraUpdateSchema.validate(req.body);
        if (error) {
            return sendErrorClient(res, error, 400);
        }

        const { id } = req.params;
        const compra = await compraRepository.findOneBy({ id: parseInt(id) });

        if (!compra) {
            return res.status(404).json({ message: "Compra no encontrada" });
        }

        compraRepository.merge(compra, req.body);
        const resultado = await compraRepository.save(compra);

        // Si la secretaria aprueba el pago, debería cambiar el rol de la persona a "Alumno"
        if (req.body.estado_pago === "Aprobado") {
            const persona = await personaRepository.findOneBy({ id: compra.id_persona });
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
