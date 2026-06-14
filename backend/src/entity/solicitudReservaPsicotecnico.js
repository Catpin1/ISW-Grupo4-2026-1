// src/entities/solicitud_reserva.entity.js
"use strict";
import { EntitySchema } from "typeorm";

export const SolicitudReserva = new EntitySchema({
  name: "SolicitudReserva",
  tableName: "SolicitudesReserva",
  columns: {
    id: { type: "int", primary: true, generated: true },
    fechaSolicitud: { type: "datetime", default: () => "CURRENT_TIMESTAMP" },
    fechaInicio: { type: "datetime", nullable: false }, // Cuándo quiere el alumno
    fechaFin: { type: "datetime", nullable: false },
    motivo: { type: "varchar", length: 250, nullable: false }, // "Evaluación de estrés"
    estado: { 
      type: "varchar", 
      length: 20, 
      default: "PENDIENTE", 
      nullable: false 
    },
    observaciones: { type: "text", nullable: true } // Notas de la secretaria al rechazar/aprobar
  },
  relations: {
    solicitante: {
      targetType: "Persona",
      type: "many-to-one",
      joinColumn: { name: "solicitanteId", nullable: false },
      onDelete: "CASCADE"
    },
    sala: {
      targetType: "SalaPsicotecnica",
      type: "many-to-one",
      joinColumn: { name: "salaId", nullable: true }, // Null si está pendiente de asignar sala
      onDelete: "SET NULL"
    },
    aprobadora: {
      targetType: "Persona", // La secretaria que aprobó
      type: "many-to-one",
      joinColumn: { name: "aprobadoraId", nullable: true },
      onDelete: "SET NULL"
    }
  }
});