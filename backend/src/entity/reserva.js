"use strict";
import { EntitySchema } from "typeorm";

export const Reserva = new EntitySchema({
  name: "Reserva",
  tableName: "Reservas",
  columns: {
    id: { type: "int", primary: true, generated: true },
    fechaInicio: { type: "datetime", nullable: false },
    fechaFin: { type: "datetime", nullable: false },
    motivo: { type: "varchar", length: 200, nullable: false }, // "Clase Teórica de Cálculo"
    
    // Estados: 'PENDIENTE', 'APROBADA', 'RECHAZADA'
    estado: { 
      type: "varchar", 
      length: 20, 
      default: "PENDIENTE",
      nullable: false 
    },
    fechaCreacion: { type: "datetime", default: () => "CURRENT_TIMESTAMP" }
  },
  relations: {
    sala: {
      targetType: "Sala",
      type: "many-to-one",
      joinColumn: { name: "salaId", nullable: false },
      onDelete: "CASCADE"
    },
    solicitante: {
      targetType: "Persona", // Quien pidió la sala (ej. Profesor o Estudiante)
      type: "many-to-one",
      joinColumn: { name: "solicitanteId", nullable: false },
      onDelete: "CASCADE"
    },
    aprobadora: {
      targetType: "Persona", // La Secretaria que aprobó (puede ser null si está pendiente)
      type: "many-to-one",
      joinColumn: { name: "aprobadoraId", nullable: true },
      onDelete: "SET NULL"
    }
  }
});