"use strict";

import { EntitySchema } from "typeorm";

const PlanSchema = new EntitySchema({
name: "Plan",
tableName: "Planes",
columns: {
    id:{
        type: "int",
        nullable: false,
        primary: true,
        generated: true,

    },
    nombre:{
        type: "varchar",
        length: 100,
        nullable: false,
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

export default PlanSchema;