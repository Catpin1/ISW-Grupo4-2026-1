"use strict";

import { authService, register } from "../services/auth.service.js";
import { loginSchema, registerSchema } from "../validations/auth.val.js";
import { sendErrorClient,
         sendErrorServer,
         sendSuccess,
} from "../handlers/ResponseHandlers.js";

export async function login(req, res){
    try{
        const { body } = req;
        const { error } = loginSchema.validate(body);

        if(error){
            return sendErrorClient(res, 400, "Datos entrada invalidos", error.message);
        }
        const [result, errorLogin] = await authService(body);

        if (errorLogin){
            return sendErrorClient(res, 401, "Error autenticacion", errorLogin);
        }

        const { user, accessToken } = result;

        res.cookie("jwt", accessToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
            maxAge: 24*60*60*1000, //24 horas
        });

        sendSuccess(res, 200, "Inicio de sesion correcto", {user});
    }catch (error){
        sendErrorServer(res, 500, "Error interno de server", error.message);
    }
}

export async function register(req, res) {
    try{
        const { body } = req;
        const { error } = registerSchema.validate(body);
        if (error) {
            return sendErrorClient(res, 400, "Datos entrada invalidos", error.message);
        }

        const [user, errorRegister ] = await register(body);
        if (errorRegister) {
            return sendErrorClient(res, 400, "Error al registrar usuario", errorRegister);
        }
        sendSuccess(res, 201, "Usuario Registrado", user);
    }catch(error){
        sendErrorServer(res, 500, "Error interno de server", error.message);
    }
}
export async function logout(req, res) {
    try {
    res.clearCookie("jwt", {
        httpOnly:true,
        secure: process.env.NODE_ENV === "production",
        sameSite:"strict",
    });
    sendSuccess(res, 200, "sesion cerrada");
    }catch(error){
        sendErrorServer(res, 500, "Error interno de server", error.message);
    }
    
}