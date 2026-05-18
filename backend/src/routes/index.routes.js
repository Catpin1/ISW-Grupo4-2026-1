"use strict";

import { Router } from "express";
import personaRoutes from "./Persona.routes.js";
import authRoutes from "./auth.routes.js";
import compraRoutes from "./Compra.routes.js";
import claseRoutes from "./Clase.routes.js";
import evaluacionPracticaRoutes from "./EvaluacionPractica.routes.js";
import evaluacionTeoricaRoutes from "./EvaluacionTeorica.routes.js";

const router = Router();

router.get("/", (req, res) => {
    res.json({ message: "Bienvenido" });
});

router.use("/auth", authRoutes);
router.use("/compras", compraRoutes);
router.use("/persona", personaRoutes);
router.use("/clases", claseRoutes);
router.use("/evaluaciones-practicas", evaluacionPracticaRoutes);
router.use("/evaluaciones-teoricas", evaluacionTeoricaRoutes);

export default router;
