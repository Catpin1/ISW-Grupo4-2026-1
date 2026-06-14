// src/entities/asignacion_clase.entity.js
"use strict";
import { EntitySchema } from "typeorm";

export const AsignacionClase = new EntitySchema({
  name: "AsignacionClase",
  tableName: "AsignacionesClase",
  columns: {
    id: { type: "int", primary: true, generated: true },
    estado: { 
      type: "varchar", 
      length: 20, 
      default: "ASIGNADO", 
      nullable: false 
    },
    fechaAsignacion: { type: "datetime", default: () => "CURRENT_TIMESTAMP" }
  },
  relations: {
    profesor: {
      targetType: "Persona",
      type: "many-to-one",
      joinColumn: { name: "profesorId", nullable: false },
      onDelete: "CASCADE"
    },
    horario: {
      targetType: "HorarioSemanal",
      type: "many-to-one",
      joinColumn: { name: "horarioId", nullable: false },
      onDelete: "CASCADE"
    },
    creadaPor: {
      targetType: "Persona", // La secretaria que hizo la asignación
      type: "many-to-one",
      joinColumn: { name: "secretariaId", nullable: false },
      onDelete: "NO ACTION"
    }
  }
});