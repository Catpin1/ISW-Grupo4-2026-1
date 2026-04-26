"use strict";

import { EntitySchema } from "typeorm";

const AsistenciaSchema = new EntitySchema({
name: "Asistencia",
tableName: "Asistencias",
columns: {
    id:{
        type: "int",
        nullable: false,
        primary: true,
        generated: true,
    },
    personaid:{
        type: "int",
        nullable: false,
        foreignKey: true,
    },
    claseid:{
        type: "int",
        nullable: false,
        foreignKey: true,
    },
    salaid:{
        type: "int",
        nullable: true,
        foreignKey: true,
    },
    fecha:{
        type: "timestamp",
        nullable: false,
    }
}
})