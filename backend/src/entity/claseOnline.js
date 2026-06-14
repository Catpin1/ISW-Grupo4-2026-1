// src/entities/clase_virtual.entity.js
"use strict";
import { EntitySchema } from "typeorm";

export const ClaseVirtual = new EntitySchema({
  name: "ClaseVirtual",
  tableName: "ClasesVirtuales",
  columns: {
    id: { type: "int", primary: true, generated: true },
    titulo: { type: "varchar", length: 100, nullable: false }, // "Clase 5: Álgebra"
    linkReunion: { type: "text", nullable: false }, // URL de Meet
    codigoIngreso: { type: "varchar", length: 50, nullable: false }, // Clave o código
    fechaProgramada: { type: "datetime", nullable: false },
    duracionMinutos: { type: "int", default: 60 },
    estado: { 
      type: "varchar", 
      length: 20, 
      default: "PROGRAMADA", 
      nullable: false 
      // 'PROGRAMADA', 'EN_CURSO', 'FINALIZADA'
    }
  },
  relations: {
    profesor: {
      targetType: "Persona",
      type: "many-to-one",
      joinColumn: { name: "profesorId", nullable: false }
    },
    inscripciones: {
      targetType: "InscripcionClase",
      type: "one-to-many",
      inverseSide: "clase"
    }
  }
});