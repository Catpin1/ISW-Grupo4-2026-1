"use strict";

import { EntitySchema } from "typeorm";

const VehiculoSchema = new EntitySchema({
name: "Vehiculo",
tableName: "Vehiculos",
columns: {
    matricula:{
        type: "varchar",
        nullable: false,
        primary: true,
    },
    tipo:{
        type: "varchar",
        length: 30,
        nullable: false,
    },
    modelo:{
        type: "varchar",
        length: 30,
        nullable: false,
    },
    marca:{
        type: "varchar",
        length: 30,
        nullable: false,
    },
    disponible:{
        type:"boolean",
        nullable: false,
    }
}
})