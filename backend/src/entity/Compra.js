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
            default: "Pendiente de validacion",
            nullable: false,
        },
        fecha: {
            type: "timestamp",
            createDate: true,
            nullable: false,
        },
        comprobante: {
            type: "varchar",
            length: 300,
            nullable: true,
        },
        comentario_admin: {
            type: "varchar",
            length: 800,
            nullable: true,
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
        plan: {
            target: "Plan",
            type: "many-to-one",
            joinColumn: {
                name: "id_plan",
                referencedColumnName: "id",
            },
            nullable: false,
        }
    }
});

export default CompraSchema;
