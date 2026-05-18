"use strict";

import { EntitySchema } from "typeorm";

const CompraSchema = new EntitySchema({
    name: "Compra",
    tableName: "Compras",
    columns: {
        id: {
            type: "int",
            primary: true,
            generated: true,
        },

        descripcion: {
            type: "varchar",
            length: 255,
            nullable: false,
        },
        monto: {
            type: "int",
            nullable: false,
        },
        estado_pago: {
            type: "varchar",
            length: 50,
            default: "'Pendiente'",
            nullable: false,
        },
        fecha: {
            type: "timestamp",
            createDate: true,
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
        }
    }
});

export default CompraSchema;
