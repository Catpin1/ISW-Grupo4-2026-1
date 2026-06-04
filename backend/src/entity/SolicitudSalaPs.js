"use strict";

import { EntitySchema } from "typeorm";

const SolicitudSalaPsSchema = new EntitySchema({
    name: "SolicitudSalaPs",
    tableName: "SolicitudesSalaPs",
    columns:{
        id: {
            type:"int",
            primary: true,
            generated: true,
        },
        descripcion: {
            type:"varchar",
            length: 100,
            nullable: false,
        },
        asistentes: {
            type:"int",
            nullable: false,
            default: "2",
        },
        estado_solicitud:{
            type:"varchar",
            length: 20,
            nullable: false,
            default:"Pendiente"
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
        joinColumn:{
            name:"id_persona",
            referencedColumnName:"id",
        },
        onDelete: "CASCADE",
        nullable: false,
    },
    sala: {
        target: "Sala",
        type: "many-to-one",
        joinColumn:{
            name:"id_sala",
            referencedColumnName:"id"
        },
        onDelete:"SET NULL",
        nullable: true,
    }
}
});

export default SolicitudSalaPsSchema;