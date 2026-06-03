"use strict";

import { Router } from "express";
import { authenticateJwt } from "../middleware/authentication.mw.js";
import { authorizeRoles } from "../middleware/authorization.mw.js";

import {
    getAllPlanes,
    getPlanById,
    createPlan,
    updatePlan,
    deletePlan,
} from "../controllers/Plan.controller.js";

const router = Router();

router
    .get("/", getAllPlanes)
    .get("/:id", getPlanById)
    .post("/", authenticateJwt, authorizeRoles("Admin", "Secretario"), createPlan)
    .put("/:id", authenticateJwt, authorizeRoles("Admin", "Secretario"), updatePlan)
    .delete("/:id", authenticateJwt, authorizeRoles("Admin", "Secretario"), deletePlan);

export default router;
