"use strict";

export const authorizeRoles = (...roles) => {
    return (req, res, next) => {
        try {
         
            if (!req.user) {
                return res.status(403).json({ message: "Usuario no autenticado" });
            }

            // rol
            if (!roles.includes(req.user.rol)) {
                return res.status(403).json({ message: "No autorizado" });
            }

            next();

        } catch (error) {
            return res.status(500).json({ message: "Error en autorización" });
        }
    };
};