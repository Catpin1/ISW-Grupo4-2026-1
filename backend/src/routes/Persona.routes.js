"use strict";

import { Router } from "express";
import { authenticateJwt } from "../middleware/authentication.mw.js";
import { authorizeRoles } from "../middleware/authorization.mw.js";
import { uploadFields } from "../middleware/upload.mw.js";

import {
    getpersona,
    createpersona,
    updatepersona,
    deletepersona,  
} from "../controllers/Persona.controller.js";

const router = Router();

router.use(authenticateJwt);

router

.get("/", authorizeRoles("admin"), getPersonas)
.get("/detail/", authorizeRoles("admin"), getpersona)
.post("/", uploadFields, authorizeRoles("admin"),createpersona)
.patch("/detail/", uploadFields, authorizeRoles("admin"), updatepersona)
.delete("/detail", authorizeRoles("admin"), deletepersona);

export default router;