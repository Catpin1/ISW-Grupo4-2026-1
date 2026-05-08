"use strict";

import bcrypt from "bcryptjs";
import { AppDataSource } from "./configDb.js";

async function encryptPassword(PASSWORD) {
    const saltRounds = 10;
    return await bcrypt.hash(PASSWORD, saltRounds);
}

export async function createPersonas() {
    try {
        const PersonaRepository = AppDataSource.getRepository("Persona");
        const count = await PersonaRepository.count();

        if (count > 0) {
            console.log("✓ Usuarios ya existen, omitiendo creación");
            return;
        }

        console.log("Creando usuarios iniciales...");

        //Generar usuarios Iniciales
        await Promise.all([
            PersonaRepository.save(PersonaRepository.create({
                nombrecompleto: "Admin",
                correo: "admin@conduccion.com",
                password: await encryptPassword("admin123"),
                rut: "12345678-9",
                rol: "Admin",
                direccion: "local",
                localidad: "local",
                edad: 40
            })),
            PersonaRepository.save(PersonaRepository.create({
                nombrecompleto: "Secretario",
                correo: "secretario@conduccion.com",
                password: await encryptPassword("secret123"),
                rut: "12345679-0",
                rol: "Secretario",
                direccion: "local1",
                localidad: "local1",
                edad: 30
            })),
            PersonaRepository.save(PersonaRepository.create({
                nombrecompleto: "Pedro",
                correo: "pedro@gmail.com",
                password: await encryptPassword("pedrito123"),
                rut: "19345156-2",
                rol: "Alumno",
                direccion: "Maipu 32",
                localidad: "Concepcion",
                edad: 27,
            })),
            PersonaRepository.save(PersonaRepository.create({
                nombrecompleto: "Alex",
                correo: "alex125@gmail.com",
                password: await encryptPassword("Profesor213"),
                rut: "19145265-3",
                rol: "Profesor",
                direccion: "O'higgins 51",
                localidad: "Concepcion",
                edad: 34
            })),
        ]);
        console.log("Usuarios creados correctamente");
    } catch (error) {
        console.error("Error al crear usuarios:", error.message);
    }
}