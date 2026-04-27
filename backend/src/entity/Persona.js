"use strict";

import { EntitySchema } from "typeorm";

const PersonaSchema = new EntitySchema({
name: "Persona",
tableName: "Personas",
columns: {

    id:{
        type: "int",
        primary: true,
        generated: true,
    },
    rut: {
        type: "varchar",
        length: 20,
        nullable: false,
        unique: true,
    },
    correo:{
        type:"varchar",
        length: 100,
        nullable: false,
        unique: true,
    },
    password:{
        type: "varchar",
        length: 100,
        nullable: false,
    },
    nombrecompleto: {
        type: "varchar",
        length: 100,
        nullable: false,
    },
    rol:{
        type: "varchar",
        length: 13,
        nullable: false,
    },
    direccion:{
        type: "varchar",
        length: 100,
        nullable: false,
    },
    localidad:{
        type: "varchar",
        length: 100,
        nullable: false,
    },
    edad: {
        type: "int",
        nullable: false,
    }
}
})