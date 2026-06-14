// src/services/sala.service.js
import { DataSource } from "typeorm";
import { Persona } from "../entities/persona.entity.js";
import { Sala } from "../entities/sala.entity.js";
import { Reserva } from "../entities/reserva.entity.js";

export const AppDataSource = new DataSource({
  type: "sqlite",
  database: "gestion_salas.db",
  synchronize: true,
  logging: false,
  entities: [Persona, Sala, Reserva],
});

export class SalaService {
  constructor(dataSource) {
    this.reservaRepo = dataSource.getRepository(Reserva);
    this.personaRepo = dataSource.getRepository(Persona);
    this.salaRepo = dataSource.getRepository(Sala);
  }

  // 1. La Secretaria crea una reserva por alguien (ej. un profesor que no tiene acceso al sistema)
  async crearReserva(solicitanteNombre, salaNombre, fechaInicio, fechaFin, motivo) {
    await AppDataSource.initialize();

    // Buscar usuario solicitante (debe ser profesor o estudiante)
    const solicitante = await this.personaRepo.findOne({
      where: { nombre: solicitanteNombre }
    });
    if (!solicitante) throw new Error("❌ Solicitante no encontrado.");

    // Buscar sala
    const sala = await this.salaRepo.findOne({ where: { nombre: salaNombre } });
    if (!sala) throw new Error("❌ Sala no encontrada.");

    // Crear la reserva (Estado: PENDIENTE)
    const nuevaReserva = this.reservaRepo.create({
      solicitante,
      sala,
      fechaInicio,
      fechaFin,
      motivo,
      estado: "PENDIENTE"
    });

    await this.reservaRepo.save(nuevaReserva);
    console.log(`📅 Solicitud creada: ${motivo} en ${sala.nombre} (Estado: PENDIENTE)`);
    return nuevaReserva;
  }

  // 2. La Secretaria APROBA la solicitud
  async aprobarReserva(secretariaNombre, reservaId) {
    await AppDataSource.initialize();

    // Validar secretaria
    const secretaria = await this.personaRepo.findOne({
      where: { nombre: secretariaNombre, tipo: "SECRETARIA" }
    });
    if (!secretaria) throw new Error("❌ No eres secretaria o no te encuentras.");

    // Buscar reserva
    const reserva = await this.reservaRepo.findOne({
      where: { id: reservaId },
      relations: ["solicitante", "sala"]
    });

    if (!reserva) throw new Error("❌ Reserva no encontrada.");
    if (reserva.estado === "APROBADA") throw new Error("⚠️ Esta reserva ya estaba aprobada.");
    if (reserva.estado === "RECHAZADA") throw new Error("⚠️ Esta reserva fue rechazada previamente.");

    // APROBAR
    reserva.estado = "APROBADA";
    reserva.aprobadora = secretaria;

    await this.reservaRepo.save(reserva);

    console.log(`✅ APROBADO: La secretaria ${secretaria.nombre} aprobó la reserva para ${reserva.solicitante.nombre} en ${reserva.sala.nombre}.`);
    return reserva;
  }

  // 3. La Secretaria RECHAZA la solicitud
  async rechazarReserva(secretariaNombre, reservaId, razon) {
    await AppDataSource.initialize();

    const secretaria = await this.personaRepo.findOne({
      where: { nombre: secretariaNombre, tipo: "SECRETARIA" }
    });
    if (!secretaria) throw new Error("❌ No eres secretaria.");

    const reserva = await this.reservaRepo.findOne({ where: { id: reservaId } });
    if (!reserva) throw new Error("❌ Reserva no encontrada.");
    if (reserva.estado !== "PENDIENTE") throw new Error("⚠️ Solo se pueden rechazar solicitudes pendientes.");

    reserva.estado = "RECHAZADA";
    reserva.aprobadora = secretaria; // Se guarda quién rechazó también
    // Opcional: guardar la razón en un campo extra si lo agregamos a la entidad

    await this.reservaRepo.save(reserva);
    console.log(`❌ RECHAZADO: La secretaria ${secretaria.nombre} rechazó la reserva ID ${reservaId}. Razón: ${razon}`);
    return reserva;
  }
  
  // Listar pendientes para la secretaria
  async listarPendientes() {
    await AppDataSource.initialize();
    const pendientes = await this.reservaRepo.find({
      where: { estado: "PENDIENTE" },
      relations: ["solicitante", "sala"]
    });
    return pendientes;
  }
}