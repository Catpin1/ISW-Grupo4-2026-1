"use strict";

import jwt from "jsonwebtoken";

export const authenticateJwt = (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;

   
        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return res.status(401).json({ message: "Token no proporcionado" });
        }


        const token = authHeader.split(" ")[1];

        // token
        const decoded = jwt.verify(
            token,
            process.env.JWT_SECRET || "secretito"
        );


        req.user = decoded;

        next();

    } catch (error) {
        return res.status(401).json({ message: "Token inválido" });
    }
};
