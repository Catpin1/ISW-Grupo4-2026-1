"use strict";

import { EntitySchema } from "typeorm";

const SalaSchema = new EntitySchema({
name: "Sala",
tableName: "Salas",
columns: {
    id:{
        type: "int",
        nullable: false,
        generated: true,
        primary: true,
    },
    tipo:{
        type: "varchar",
        length: 30,
        nullable: false,
    },
    cantidadmaxima:{
        type: "int",
        nullable: false,
    },
    disponible:{
        type: "Boolean",
        nullable: false,
    }
}
})