// src/entities/horario_semanal.entity.js
"use strict";
import { EntitySchema } from "typeorm";

export const HorarioSemanal = new EntitySchema({
  name: "HorarioSemanal",
  tableName: "HorariosSemanal",
  columns: {
    id: { type: "int", primary: true, generated: true },
    diaSemana: { type: "varchar", length: 20, nullable: false }, // 'LUNES', 'MARTES'
    horaInicio: { type: "time", nullable: false }, // '08:00:00'
    horaFin: { type: "time", nullable: false },    // '10:00:00'
    descripcion: { type: "varchar", length: 100, nullable: true } // "Bloque Mañana"
  },
  relations: {
    asignaciones: {
      targetType: "AsignacionClase",
      type: "one-to-many",
      inverseSide: "horario"
    }
  }
});