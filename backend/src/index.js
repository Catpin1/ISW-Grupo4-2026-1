"use strict";

import express from "express";
import cors from "cors";
import morgan from "morgan";
import cookieParser from "cookie-parser";

import routes from "./routes/index.routes.js";
import { AppDataSource } from "./config/configDb.js";
import { createPersonas } from "./config/initialSetup.js";

const app = express();

// Config
const PORT = process.env.PORT || 3000;
const HOST = process.env.HOST || "localhost";

// Middlewares
app.use(cors());
app.use(morgan("dev"));
app.use(express.json());
app.use(cookieParser());

// Routes
app.use("/api", routes);

app.get("/", (req, res) => {
    res.send("API funcionando");
});

// Inicializar DB + servidor
async function startServer() {
    try {
        await AppDataSource.initialize();
        console.log("Base de datos conectada");

        await createPersonas();

        app.listen(PORT, "0.0.0.0", () => {
            console.log(`Servidor corriendo en:`);
            console.log(`   Local:   http://localhost:${PORT}`);
            console.log(`   Network: http://${HOST}:${PORT}`);
        });

    } catch (error) {
        console.error("Error al iniciar servidor:");
        console.error(error);
        process.exit(1);
    }
}

startServer();