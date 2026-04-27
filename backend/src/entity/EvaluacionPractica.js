"use strict";

import { EntitySchema } from "typeorm";

const EvaluacionPracticaSchema = new EntitySchema({
name: "EvaluacionPractica",
tableName: "EvaluacionesPracticas",
columns: {
    id:{
        type: "int",
        nullable: false,
        generated: true,
        primary: true,
    },
    resultado:{
        type: "varchar",
        length: 30,
        nullable: false,
    },
    numerofaltagrave:{
        type: "int",
        nullable: true,
    },
    numerofaltamedia:{
        type: "int",
        nullable: true,
    },
    numerofaltabaja:{
        type: "int",
        nullable: true,
    },

}
})