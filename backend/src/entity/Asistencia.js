"use strict";

import { EntitySchema } from "typeorm";

const AsistenciaSchema = new EntitySchema({
    name: "Asistencia",
    tableName: "Asistencias",
    columns: {
        id: {
            type: "int",
            nullable: false,
            primary: true,
            generated: true,
        },
        fecha: {
            type: "timestamp",
            nullable: false,
        }
    },
    relations: {
        persona: {
            target: "Persona",
            type: "many-to-one",
            joinColumn: {
                name: "id_persona",
                referencedColumnName: "id",
            },
            onDelete: "CASCADE",
            nullable: false,
        },
        clase: {
            target: "Clase",
            type: "many-to-one",
            joinColumn: {
                name: "id_clase",
                referencedColumnName: "ID",
            },
            onDelete: "CASCADE",
            nullable: false,
        },
        sala: {
            target: "Sala",
            type: "many-to-one",
            joinColumn: {
                name: "id_sala",
                referencedColumnName: "id",
            },
            onDelete: "SET NULL",
            nullable: true,
        }
    }
});

export default AsistenciaSchema;
