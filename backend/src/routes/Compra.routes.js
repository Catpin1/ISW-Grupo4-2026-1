"use strict";

import { Router } from "express";
import { authenticateJwt } from "../middleware/authentication.mw.js";
import { authorizeRoles } from "../middleware/authorization.mw.js";

import {
    createCompra,
    getCompras,
    getCompra,
    updateEstadoCompra
} from "../controllers/Compra.controller.js";

const router = Router();

router.use(authenticateJwt);

router
    // Cualquier usuario logueado (Alumno, Usuario, etc.) debería poder crear su compra
    .post("/", createCompra)
    // Solo Admin y Secretario pueden ver todas las compras o validarlas
    .get("/", authorizeRoles("Admin", "Secretario"), getCompras)
    .get("/:id", authorizeRoles("Admin", "Secretario"), getCompra)
    .patch("/:id/estado", authorizeRoles("Admin", "Secretario"), updateEstadoCompra)
    .put("/:id/estado", authorizeRoles("Admin", "Secretario"), updateEstadoCompra);

export default router;