"use strict";

import { Router } from "express";
import { authenticateJwt } from "../middleware/authentication.mw";
import { authorizeRoles } from "../middleware/authorization.mw";

import {
    createSolicitudSalaPs,
    getSolicitudSalaPsId,
    getSolicitudSalaPs,
    updateEstadoSolicitud
} from "../controllers/SolicitudSalaPs.controller.js";

const router = router();

router.use(authenticateJwt);

router
.post("/", createSolicitudSalaPs)
.get("/", authorizeRoles("Alumno"), getSolicitudSalaPs)
.get("/:id",authorizeRoles("Alumno"), getSolicitudSalaPsId)
.patch("/:id/estado", authorizeRoles("Secretario", "Admin"), updateEstadoSolicitud)
.put("/:id/estado", authorizeRoles("Secretario", "Admin"), updateEstadoSolicitud)

export default router;