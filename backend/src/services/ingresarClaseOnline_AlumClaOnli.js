// src/services/aula_virtual.service.js
import { DataSource } from "typeorm";
import { Persona } from "../entities/persona.entity.js";
import { ClaseVirtual } from "../entities/clase_virtual.entity.js";
import { InscripcionClase } from "../entities/inscripcion_clase.entity.js";

export const AppDataSource = new DataSource({
  type: "sqlite",
  database: "aula_virtual.db",
  synchronize: true,
  logging: false,
  entities: [Persona, ClaseVirtual, InscripcionClase],
});

export class AulaVirtualService {
  constructor(dataSource) {
    this.inscripcionRepo = dataSource.getRepository(InscripcionClase);
    this.claseRepo = dataSource.getRepository(ClaseVirtual);
    this.personaRepo = dataSource.getRepository(Persona);
  }

  /**
   * Inscribe a un alumno en una clase (lo hace la secretaria o el sistema)
   */
  async inscribirAlumno(nombreAlumno, claseId) {
    await AppDataSource.initialize();

    const alumno = await this.personaRepo.findOne({
      where: { nombre: nombreAlumno, tipo: "ALUMNO", activo: true }
    });
    if (!alumno) throw new Error("❌ Alumno no encontrado o no es ALUMNO.");

    const clase = await this.claseRepo.findOne({ where: { id: claseId } });
    if (!clase) throw new Error("❌ Clase no encontrada.");

    // Verificar si ya está inscrito
    const yaInscrito = await this.inscripcionRepo.findOne({
      where: { alumno: { id: alumno.id }, clase: { id: clase.id } }
    });
    if (yaInscrito) throw new Error("⚠️ Alumno ya inscrito en esta clase.");

    const nuevaInscripcion = this.inscripcionRepo.create({
      alumno,
      clase,
      estado: "ACTIVO"
    });

    await this.inscripcionRepo.save(nuevaInscripcion);
    console.log(`✅ ${alumno.nombre} inscrito en la clase: ${clase.titulo}`);
    return nuevaInscripcion;
  }

  /**
   * EL ALUMNO CONECTA: Obtiene el link y la clave de la clase.
   * @param {string} nombreAlumno - El nombre del usuario logueado
   * @param {number} claseId - El ID de la clase a la que quiere entrar
   */
  async obtenerDatosClase(nombreAlumno, claseId) {
    await AppDataSource.initialize();

    // 1. Validar que el usuario es ALUMNO y está activo
    const alumno = await this.personaRepo.findOne({
      where: { nombre: nombreAlumno, tipo: "ALUMNO", activo: true }
    });
    if (!alumno) throw new Error("❌ Usuario no autorizado o no es ALUMNO.");

    // 2. Verificar si está inscrito en esa clase específica
    const inscripcion = await this.inscripcionRepo.findOne({
      where: { 
        alumno: { id: alumno.id }, 
        clase: { id: claseId },
        estado: "ACTIVO"
      },
      relations: ["clase"]
    });

    if (!inscripcion) {
      throw new Error("❌ No tienes acceso a esta clase. No estás inscrito.");
    }

    const clase = inscripcion.clase;

    // 3. Verificar estado de la clase (¿Ya terminó? ¿Aún no empieza?)
    const ahora = new Date();
    if (clase.estado === "FINALIZADA") {
      throw new Error("⚠️ Esta clase ya ha finalizado.");
    }
    // Opcional: Chequear si ya pasó la hora de inicio

    // 4. DEVOLVER LOS DATOS SENSIBLES (Simulando la respuesta del backend)
    return {
      exito: true,
      titulo: clase.titulo,
      linkReunion: clase.linkReunion,
      codigoIngreso: clase.codigoIngreso,
      fechaProgramada: clase.fechaProgramada
    };
  }
}