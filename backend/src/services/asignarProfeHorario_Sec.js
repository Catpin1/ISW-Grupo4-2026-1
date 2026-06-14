// src/services/planificador.service.js
import { DataSource } from "typeorm";
import { Persona } from "../entities/persona.entity.js";
import { HorarioSemanal } from "../entities/horario_semanal.entity.js";
import { AsignacionClase } from "../entities/asignacion_clase.entity.js";

export const AppDataSource = new DataSource({
  type: "sqlite",
  database: "planificacion_clases.db",
  synchronize: true,
  logging: false,
  entities: [Persona, HorarioSemanal, AsignacionClase],
});

export class PlanificadorService {
  constructor(dataSource) {
    this.profesorRepo = dataSource.getRepository(Persona);
    this.horarioRepo = dataSource.getRepository(HorarioSemanal);
    this.asignacionRepo = dataSource.getRepository(AsignacionClase);
  }

  /**
   * La secretaria asigna un profesor disponible a un horario disponible.
   */
  async asignarProfesorAHorario(secretariaNombre, profesorNombre, diaSemana, horaInicio, horaFin) {
    await AppDataSource.initialize();

    // 1. Validar Secretaria
    const secretaria = await this.profesorRepo.findOne({
      where: { nombre: secretariaNombre, tipo: "SECRETARIA", activo: true }
    });
    if (!secretaria) throw new Error("❌ No se encontró a la secretaria o no está activa.");

    // 2. Validar Profesor (Debe ser tipo PROFESOR y activo)
    const profesor = await this.profesorRepo.findOne({
      where: { nombre: profesorNombre, tipo: "PROFESOR", activo: true }
    });
    if (!profesor) throw new Error("❌ No se encontró al profesor o no está activo.");

    // 3. Buscar o Crear el Horario (Aquí asumimos que el horario ya existe en la BD)
    // Si no existe, la secretaria debería haberlo creado antes.
    const horario = await this.horarioRepo.findOne({
      where: { diaSemana, horaInicio, horaFin }
    });

    if (!horario) {
      throw new Error(`❌ El horario (${diaSemana} ${horaInicio}-${horaFin}) no existe. Crea el bloque primero.`);
    }

    // 4. Verificar si ese horario ya tiene profesor asignado
    const yaAsignado = await this.asignacionRepo.findOne({
      where: { horario: { id: horario.id }, estado: "ASIGNADO" }
    });

    if (yaAsignado) {
      throw new Error(`⚠️ El horario ${diaSemana} ${horaInicio} ya está ocupado por el profesor ${yaAsignado.profesor.nombre}.`);
    }

    // 5. Verificar si el profesor ya tiene clase en ese horario (evitar superposición)
    // Nota: Aquí simplificamos asumiendo que si el horario es único, no hay superposición.
    // En un sistema real, se verificaría si el profesor ya tiene otro horario los mismos días.
    
    // 6. Crear la Asignación
    const nuevaAsignacion = this.asignacionRepo.create({
      profesor,
      horario,
      creadaPor: secretaria,
      estado: "ASIGNADO"
    });

    await this.asignacionRepo.save(nuevaAsignacion);

    console.log(`✅ ${secretaria.nombre} asignó al profesor ${profesor.nombre} al horario: ${diaSemana} ${horaInicio}-${horaFin}.`);
    return nuevaAsignacion;
  }

  /**
   * Listar todas las asignaciones actuales
   */
  async listarAsignaciones() {
    await AppDataSource.initialize();
    return await this.asignacionRepo.find({
      relations: ["profesor", "horario", "creadaPor"]
    });
  }
}