"use strict";

import { Router } from "express";
import { authenticateJwt } from "../middleware/authentication.mw.js";
import { authorizeRoles } from "../middleware/authorization.mw.js";
import { uploadFields } from "../middleware/upload.mw.js";

import {
    getPersonas,
    getPersona,
    createPersona,
    updatePersona,
    deletePersona,  
} from "../controllers/Persona.controller.js";

const router = Router();

router.use(authenticateJwt);

router

.get("/", authorizeRoles("Admin"), getPersonas)
.get("/:id", authorizeRoles("Admin"), getPersona)
.post("/", uploadFields, authorizeRoles("Admin"), createPersona)
.patch("/:id", uploadFields, authorizeRoles("Admin"), updatePersona)
.put("/:id", uploadFields, authorizeRoles("Admin"), updatePersona)
.delete("/:id", authorizeRoles("Admin"), deletePersona);

export default router;