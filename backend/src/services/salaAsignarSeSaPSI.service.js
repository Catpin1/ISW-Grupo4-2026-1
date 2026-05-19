// este consiste en la secretaria puede cargar la disponibilidad horaria de una sala
// , para esto se debe validar que la persona que esta cargando la disponibilidad es 
// una secretaria, luego se debe validar que la sala existe, luego se debe validar que 
// los horarios son validos y finalmente se debe guardar en la base de datos.
'use strict';

const salaAsignarSeSaPSI = {
  /**
   * Carga disponibilidad horaria para una sala.
   * @param {Object} dbClient - Instancia de conexión a la BD (mysql/pool)
   * @param {number} idPersona - ID de la secretaria logueada
   * @param {number} idSala - ID de la sala
   * @param {Array} horarios - Array de objetos { dia, horaInicio, horaFin }
   */
  async cargarDisponibilidad(dbClient, idPersona, idSala, horarios) {
   //verificar que la persona es secretaria
    const queryPersona = "SELECT id, rol, nombreCompleto FROM Personas WHERE id = ?";
    const [personas] = await dbClient.query(queryPersona, [idPersona]);

    if (personas.length === 0) {
      throw new Error("La persona (secretaria) no existe.");
    }

    const persona = personas;
    
    
    if (persona.rol !== 'secretaria') {
      throw new Error(`Acceso denegado: El usuario tiene el rol '${persona.rol}', se requiere 'secretaria'.`);
    }

    //validacion de la sala
    const querySala = "SELECT id, tipo FROM Salas WHERE id = ?";
    const [salas] = await dbClient.query(querySala, [idSala]);

    if (salas.length === 0) {
      throw new Error("La sala no existe.");
    }
    const sala = salas;

   
    if (!Array.isArray(horarios) || horarios.length === 0) {
      throw new Error("Debe proporcionar al menos un horario.");
    }

    
    for (const h of horarios) {
      if (!h.dia || !h.horaInicio || !h.horaFin) {
        throw new Error("Cada horario debe tener 'dia', 'horaInicio' y 'horaFin'.");
      }
      // Validación simple de rango
      if (h.horaInicio >= h.horaFin) {
        throw new Error(`Horario inválido el ${h.dia}: la hora fin no puede ser menor a la inicio.`);
      }
    }

    
    
    const queryDisponibilidad = `
      INSERT INTO Disponibilidades (sala_id, persona_id, horarios_data, fecha_carga) 
      VALUES (?, ?, ?, NOW())
    `;
    
    // Convertimos el array de horarios a una cadena JSON para guardarla en una columna TEXT/JSON
    const horariosJSON = JSON.stringify(horarios);

    const [result] = await dbClient.query(queryDisponibilidad, [
      idSala,
      idPersona,
      horariosJSON
    ]);

    return {
      mensaje: "Disponibilidad cargada exitosamente",
      datos: {
        idDisponibilidad: result.insertId, // O el ID que devuelva tu BD
        sala: sala.tipo,
        cargadoPor: persona.nombreCompleto,
        horariosGuardados: horarios.length
      }
    };
  }
};

module.exports = salaAsignarSeSaPSI;