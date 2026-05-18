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
        id_usuario: {
            type: "int",
            nullable: false,
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
    }
});

export default CompraSchema;
