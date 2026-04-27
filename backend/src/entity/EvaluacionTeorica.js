"use strict";

import { EntitySchema } from "typeorm";

const EvaluacionTeoricaSchema = new EntitySchema({
name: "EvaluacionTeorica",
tableName: "EvaluacionesTeoricas",
columns: {
    id:{
        type: "int",
        nullable: false,
        generated: true,
        primary: true,
    },
    nota:{
        type: "float",
        nullable: false,
    },
    puntajetotal:{
        type: "int",
        nullable: false,
    }
}
})