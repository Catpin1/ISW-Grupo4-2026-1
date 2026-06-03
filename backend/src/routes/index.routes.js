"use strict";

import { Router } from "express";
import personaRoutes from "./Persona.routes.js";
import authRoutes from "./Auth.routes.js";
import compraRoutes from "./Compra.routes.js";
import planRoutes from "./Plan.routes.js";
//import claseRoutes from "./Clase.routes.js";// falta añadir las rutas de clase
//import evaluacionPracticaRoutes from "./EvaluacionPractica.routes.js";
//import evaluacionTeoricaRoutes from "./EvaluacionTeorica.routes.js";


const router = Router();

router.get("/", (req, res) => {
    res.json({ message: "Bienvenido" });
});

router.use("/auth", authRoutes);
router.use("/compras", compraRoutes);
router.use("/persona", personaRoutes);
router.use("/planes", planRoutes)   ;

//router.use("/clases", claseRoutes);// falta añadir las rutas de clase
//router.use("/evaluaciones-practicas", evaluacionPracticaRoutes);
//router.use("/evaluaciones-teoricas", evaluacionTeoricaRoutes);

export default router;
