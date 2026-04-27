"use strict";

import { EntitySchema } from "typeorm";

const planSchema = new EntitySchema({
name: "Plan",
tableName: "Planes",
columns: {
    id:{
        type: "int",
        nullable: false,
        primary: true,
    },
    precio:{
        type: "int",
        nullable: false,
    },
    descripcion:{
        type: "varchar",
        length: 500,
        nullable: false,
    }
}
})