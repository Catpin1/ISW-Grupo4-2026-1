"use strict";

import { EntitySchema } from "typeorm";

const ClaseSchema = new EntitySchema({
name: "Clase",
tableName: "Clases",
columns: {
    ID:{
        type: "int",
        nullable: false,
        generated: true,
        primary: true
    },
    modalidad:{
        type: "varchar",
        length: 30,
        nullable: false,
    },
    horainicio:{
        type: "timestamp",
        nullable: false,
    },
    horatermino:{
        type: "timestamp",
        nullable: false,
    }

}
})