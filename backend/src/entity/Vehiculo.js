"use strict";

import { EntitySchema } from "typeorm";

const VehiculoSchema = new EntitySchema({
    name: "Vehiculo",
    tableName: "Vehiculos",
    columns: {
        matricula: {
            type: "varchar",
            nullable: false,
            primary: true,
        },
        tipo: {
            type: "varchar",
            length: 30,
            nullable: false,
        },
        modelo: {
            type: "varchar",
            length: 30,
            nullable: false,
        },
        marca: {
            type: "varchar",
            length: 30,
            nullable: false,
        },
        disponible: {
            type: "boolean",
            nullable: false,
        },

        kilometraje: {
            type: "int",
            nullable: false,
        },

        permisoCirculacion: {// al momento de usar archivos, como multer, es necesario usar postman
            type: "timestamp",
            nullable: false,
        },

        soap: {
            type: "timestamp",
            nullable: false,
        },

        revisionTecnica: {
            type: "timestamp",
            nullable: false,
        }
    }
})

export default VehiculoSchema;

