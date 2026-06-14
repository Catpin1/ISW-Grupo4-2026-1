// src/entities/inscripcion_clase.entity.js
"use strict";
import { EntitySchema } from "typeorm";

export const InscripcionClase = new EntitySchema({
  name: "InscripcionClase",
  tableName: "InscripcionesClase",
  columns: {
    id: { type: "int", primary: true, generated: true },
    fechaInscripcion: { type: "datetime", default: () => "CURRENT_TIMESTAMP" },
    estado: { 
      type: "varchar", 
      length: 20, 
      default: "ACTIVO", 
      nullable: false 
    }
  },
  relations: {
    alumno: {
      targetType: "Persona",
      type: "many-to-one",
      joinColumn: { name: "alumnoId", nullable: false },
      onDelete: "CASCADE"
    },
    clase: {
      targetType: "ClaseVirtual",
      type: "many-to-one",
      joinColumn: { name: "claseId", nullable: false },
      onDelete: "CASCADE"
    }
  }
});