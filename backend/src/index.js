"use strict";

import express from "express";
import cors from "cors";
import morgan from "morgan";
import cookieParser from "cookie-parser";

import routes from "./routes/index.routes.js";
import { AppDataSource } from "./config/configDb.js";
import { createPersonas } from "./config/initialSetup.js";

const app = express();

app.use(cors());
app.use(morgan("dev"));
app.use(express.json());
app.use(cookieParser());

app.use("/api", routes);

app.get("/", (req, res) => {
    res.send("API funcionando");
});

const PORT = process.env.PORT || 3000;

AppDataSource.initialize()
    .then(async () => {
        console.log("Base de datos conectada");
        
        // Crear usuarios iniciales
        await createPersonas();
        
        app.listen(PORT, () => {
            console.log(`Servidor en http://localhost:${PORT}`);
        });
    })
    .catch((error) => {
        console.error("Error DB:", error);
    });