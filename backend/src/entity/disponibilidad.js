// src/entities/Disponibilidad.js (o .ts)
import { EntitySchema } from "typeorm";

const DisponibilidadSchema = new EntitySchema({
  name: "Disponibilidad",
  tableName: "Disponibilidades",
  columns: {
    id: {
      type: "int",
      primary: true,
      generated: true,
    },
    fechaCarga: {
      type: "timestamp",
      createDate: true,
            nullable: false,
    },
    horarios: {
      type: "json", // Guarda el array de horarios como texto JSON
      nullable: false
    }
}
});

export default DisponibilidadSchema;