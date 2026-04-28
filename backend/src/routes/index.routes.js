"use strict";

import { Router } from "express";
import personaRoutes from "./Persona.routes.js";
import authRoutes from "./auth.routes.js";

const router = Router();

router.get("/", (req, res) => {
    res.json({ message: "Bienvenido" });
});

router.use("/auth", authRoutes);
router.use("/persona", personaRoutes);

export default router;