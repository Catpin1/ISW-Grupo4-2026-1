"use strict";

import bcrypt from "bcrypt.js";
import { AppDataSource } from "./configDb.js";
import Persona from "../entity/Persona.js";

async function encryptPassword(PASSWORD) {
    const saltRounds = 10;
    return await bcrypt.hash(PASSWORD, saltRounds);
}

export async function createPersonas() {
    try {
        const PersonaRepository = AppDataSource.getRepository(Persona);
        const count = await userRepository.count();

        if (count > 0) return;

        const now = new Date();

        //Generar usuarios Iniciales
        await Promise.all([
            userRepository.save(userRepository.create({
                nombrecompleto: "Admin",
                correo: "admin@conduccion.com",
                password: await encryptPassword("admin123"),
                rut: "12345678-9 ",
                rol: "admin",
                direccion: "local",
                localidad: "local",
                edad: 40
            })),
            userRepository.save(userRepository.create({
                nombrecompleto: "secretario",
                correo: "secretarion@conduccion.com",
                password: await encryptPassword("secret123"),
                rut: "1234",
                rol: "secretario",
                direccion: "local1",
                localidad: "local1",
                edad: 30
            })),
            userRepository.save(userRepository.create({
                nombrecompleto: "Pedro",
                correo:"pedro@gmail.com",
                password: await encryptPassword("pedrito"),
                rut: "19345156-2",
                rol: "alumno",
                direccion: "Maipu 32",
                localidad: "Concepcion",
                edad: 27,
            })),
            userRepository.save(userRepository.create({
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
    }catch (error){
        console.error("Error al crear usuarions", error)
    }
}