"use strict";

import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { AppDataSource } from "../config/configDb.js";

const personaRepository = AppDataSource.getRepository("Persona");

export const login = async ({ correo, password }) => {
    try {
        // Buscar usuario
        const persona = await personaRepository.findOneBy({ correo });

        if (!persona) {
            throw { status: 404, message: "Usuario no encontrado" };
        }

        const passwordValida = await bcrypt.compare(password, persona.password);

        if (!passwordValida) {
            throw { status: 401, message: "Contraseña incorrecta" };
        }

        if (persona.rol.toLowerCase() !== "admin") {
        throw { status: 403, message: "Acceso solo para administradores" };
        }

        const token = jwt.sign(
            {
                id: persona.id,
                rol: persona.rol,
                correo: persona.correo
            },
            process.env.JWT_SECRET || "secretito",
            { expiresIn: "1h" }
        );

        return {
            message: "Login exitoso",
            token,
            user: {
                id: persona.id,
                nombre: persona.nombrecompleto,
                correo: persona.correo,
                rol: persona.rol
            }
        };

    } catch (error) {
        throw error.status ? error : { status: 500, message: "Error en login" };
    }
};


export const register = async (data) => {
    try {

        const hashedPassword = await bcrypt.hash(data.password, 10);


        const nuevaPersona = personaRepository.create({
            ...data,
            password: hashedPassword
        });

        const resultado = await personaRepository.save(nuevaPersona);

        return {
            message: "Usuario admin creado correctamente",
            user: {
                id: resultado.id,
                correo: resultado.correo,
                nombre: resultado.nombrecompleto,
                rol: resultado.rol
            }
        };

    } catch (error) {

      
        if (error.code === "23505") {
            throw { status: 400, message: "El RUT o correo ya están registrados" };
        }

        throw { status: 500, message: "Error al registrar usuario" };
    }
};