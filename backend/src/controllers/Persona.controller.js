"use strict";

import { AppDataSource } from "../config/configDb.js"; 
const personaRepository = AppDataSource.getRepository("Persona");

export const getPersonas = async (req, res) => {
    try {
        const personas = await personaRepository.find();
        res.json(personas);
    } catch (error) {
        res.status(500).json({ message: "Error al obtener todas las personas", error });
    }
};

export const getPersona = async (req, res) => {
    try {
        const { id } = req.params;

        const persona = await personaRepository.findOneBy({ id: parseInt(id) });

        if (!persona) {
            return res.status(404).json({ message: "Persona no encontrada" });
        }

        res.json(persona);
    } catch (error) {
        res.status(500).json({ message: "Error al obtener la persona", error });
    }
};

export const createPersona = async (req, res) => {
    try {
        const nuevaPersona = personaRepository.create(req.body);
        const resultado = await personaRepository.save(nuevaPersona);

        res.status(201).json(resultado);
    } catch (error) {
        res.status(500).json({ message: "Error al crear la persona", error });
    }
};


export const updatePersona = async (req, res) => {
    try {
        const { id } = req.params;

        const persona = await personaRepository.findOneBy({ id: parseInt(id) });

        if (!persona) {
            return res.status(404).json({ message: "Persona no encontrada" });
        }

        personaRepository.merge(persona, req.body);
        const resultado = await personaRepository.save(persona);

        res.json(resultado);
    } catch (error) {
        res.status(500).json({ message: "Error al actualizar los datos de la persona", error });
    }
};

export const deletePersona = async (req, res) => {
    try {
        const { id } = req.params;

        const persona = await personaRepository.findOneBy({ id: parseInt(id) });

        if (!persona) {
            return res.status(404).json({ message: "Persona no encontrada" });
        }

        await personaRepository.remove(persona);

        res.json({ message: "Persona fue eliminada correctamente" });
    } catch (error) {
        res.status(500).json({ message: "Error al eliminar a la persona", error });
    }
};