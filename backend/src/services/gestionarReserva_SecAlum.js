// src/services/reserva.service.js
import { DataSource } from "typeorm";
import { Persona } from "../entities/persona.entity.js";
import { SalaPsicotecnica } from "../entities/sala_psicotecnica.entity.js";
import { SolicitudReserva } from "../entities/solicitud_reserva.entity.js";

export const AppDataSource = new DataSource({
  type: "sqlite",
  database: "reservas_psico.db",
  synchronize: true,
  logging: false,
  entities: [Persona, SalaPsicotecnica, SolicitudReserva],
});

export class ReservaService {
  constructor(dataSource) {
    this.solicitudRepo = dataSource.getRepository(SolicitudReserva);
    this.salaRepo = dataSource.getRepository(SalaPsicotecnica);
    this.personaRepo = dataSource.getRepository(Persona);
  }

  /**
   * 1. El alumno (o la secretaria por él) crea la solicitud.
   */
  async crearSolicitud(nombreAlumno, fechaInicio, fechaFin, motivo) {
    await AppDataSource.initialize();

    const alumno = await this.personaRepo.findOne({
      where: { nombre: nombreAlumno, tipo: "ALUMNO", activo: true }
    });
    if (!alumno) throw new Error("❌ Alumno no encontrado o no es ALUMNO.");

    const nuevaSolicitud = this.solicitudRepo.create({
      solicitante: alumno,
      fechaInicio,
      fechaFin,
      motivo,
      estado: "PENDIENTE" // Esperando revisión de la secretaria
    });

    await this.solicitudRepo.save(nuevaSolicitud);
    console.log(`📝 Solicitud creada por ${alumno.nombre} para "${motivo}" (Estado: PENDIENTE).`);
    return nuevaSolicitud;
  }

  /**
   * 2. La Secretaria revisa y aprueba si hay salas disponibles.
   */
  async aprobarSolicitud(nombreSecretaria, solicitudId) {
    await AppDataSource.initialize();

    // Validar Secretaria
    const secretaria = await this.personaRepo.findOne({
      where: { nombre: nombreSecretaria, tipo: "SECRETARIA", activo: true }
    });
    if (!secretaria) throw new Error("❌ No eres secretaria válida.");

    // Buscar solicitud
    const solicitud = await this.solicitudRepo.findOne({
      where: { id: solicitudId },
      relations: ["solicitante"]
    });
    if (!solicitud) throw new Error("❌ Solicitud no encontrada.");
    if (solicitud.estado !== "PENDIENTE") throw new Error("⚠️ Esta solicitud ya fue procesada.");

    // --- LÓGICA CLAVE: Verificar Disponibilidad de Salas ---
    // Buscamos salas psicotécnicas que estén activas y NO tengan conflictos en ese horario.
    const salasDisponibles = await this.buscarSalasDisponibles(solicitud.fechaInicio, solicitud.fechaFin);

    if (salasDisponibles.length === 0) {
      throw new Error("❌ NO HAY SALAS DISPONIBLES en el horario solicitado.");
    }

    // Seleccionamos la primera sala disponible (o podríamos tener lógica de preferencia)
    const salaAsignada = salasDisponibles;

    // --- Asignar y Aprobar ---
    solicitud.sala = salaAsignada;
    solicitud.estado = "APROBADA";
    solicitud.aprobadora = secretaria;
    solicitud.observaciones = `Asignada a: ${salaAsignada.nombre}`;

    await this.solicitudRepo.save(solicitud);

    console.log(`✅ APROBADO: La secretaria ${secretaria.nombre} aprobó la solicitud.`);
    console.log(`   -> Sala Asignada: ${salaAsignada.nombre}`);
    console.log(`   -> Horario: ${solicitud.fechaInicio.toLocaleString()} - ${solicitud.fechaFin.toLocaleString()}`);
    
    return solicitud;
  }

  /**
   * 3. La Secretaria rechaza la solicitud.
   */
  async rechazarSolicitud(nombreSecretaria, solicitudId, razon) {
    await AppDataSource.initialize();

    const secretaria = await this.personaRepo.findOne({
      where: { nombre: nombreSecretaria, tipo: "SECRETARIA" }
    });
    if (!secretaria) throw new Error("❌ No eres secretaria.");

    const solicitud = await this.solicitudRepo.findOne({ where: { id: solicitudId } });
    if (!solicitud || solicitud.estado !== "PENDIENTE") {
      throw new Error("❌ Solicitud no válida para rechazar.");
    }

    solicitud.estado = "RECHAZADA";
    solicitud.aprobadora = secretaria;
    solicitud.observaciones = razon;

    await this.solicitudRepo.save(solicitud);
    console.log(`❌ RECHAZADO: ${razon}`);
    return solicitud;
  }

  /**
   * Helper: Busca salas que NO tengan reservas aprobadas en el rango de tiempo.
   */
  async buscarSalasDisponibles(fechaInicio, fechaFin) {
    // 1. Obtener todas las salas activas
    const todasLasSalas = await this.salaRepo.find({ where: { esDisponible: true } });

    const disponibles = [];

    for (const sala of todasLasSalas) {
      // 2. Verificar si hay conflictos con reservas APROBADAS
      const conflictos = await this.solicitudRepo.count({
        where: {
          sala: { id: sala.id },
          estado: "APROBADA",
          // Lógica de superposición de fechas:
          // (SolicitudInicio < FinBusqueda) AND (SolicitudFin > InicioBusqueda)
          fechaInicio: { $lt: fechaFin },
          fechaFin: { $gt: fechaInicio }
        }
      });

      if (conflictos === 0) {
        disponibles.push(sala);
      }
    }

    return disponibles;
  }
}