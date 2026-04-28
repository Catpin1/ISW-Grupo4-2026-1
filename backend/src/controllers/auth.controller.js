"use strict";

import { login as authService, register as registerService } from "../services/auth.service.js";
import { loginSchema, registerSchema } from "../validations/auth.val.js";
import {
    sendErrorClient,
    sendErrorServer,
    sendSuccess,
} from "../handlers/ResponseHandlers.js";

export async function login(req, res) {
    try {
        const { body } = req;
        const { error } = loginSchema.validate(body);

        if (error) {
            return sendErrorClient(res, error, 400);
        }

        const result = await authService(body);
        const { token, user } = result;

        res.cookie("jwt", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
            maxAge: 24 * 60 * 60 * 1000, // 24 horas
        });

        return sendSuccess(res, { user, token }, "Inicio de sesión correcto", 200);

    } catch (error) {
        return sendErrorServer(res, error, 500);
    }
}

export async function register(req, res) {
    try {
        const { body } = req;
        const { error } = registerSchema.validate(body);

        if (error) {
            return sendErrorClient(res, error, 400);
        }

        const userRegistered = await registerService(body);

        return sendSuccess(res, userRegistered, "Usuario registrado", 201);

    } catch (error) {
        return sendErrorServer(res, error, 500);
    }
}

export async function logout(req, res) {
    try {
        res.clearCookie("jwt", {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
        });

        return sendSuccess(res, null, "Sesión cerrada", 200);

    } catch (error) {
        return sendErrorServer(res, error, 500);
    }
}
