import ApiResponse from "../helpers/ApiResponse.js";
import { authService } from "../services/index.js";

export default class AuthController {

    static async registrar(req, res, next) {

        try {

            const resultado = await authService.registrar(req.body);

            return ApiResponse.created(
                res,
                "Usuario registrado correctamente.",
                resultado
            );

        } catch (error) {

            next(error);

        }

    }

    static async login(req, res, next) {

        try {

            const metadata = {
                ip: req.ip,
                dispositivo: req.headers["user-agent"] || null
            };

            const resultado = await authService.login(req.body, metadata);

            return ApiResponse.success(
                res,
                "Inicio de sesión correcto.",
                resultado
            );

        } catch (error) {

            next(error);

        }

    }

    static async refresh(req, res, next) {

        try {

            const { refreshToken } = req.body;

            const resultado = await authService.refresh(refreshToken);

            return ApiResponse.success(
                res,
                "Token renovado correctamente.",
                resultado
            );

        } catch (error) {

            next(error);

        }

    }

    static async logout(req, res, next) {

        try {

            const { refreshToken } = req.body;

            await authService.logout(refreshToken);

            return ApiResponse.success(
                res,
                "Sesión cerrada correctamente."
            );

        } catch (error) {

            next(error);

        }

    }

    static async logoutAll(req, res, next) {

        try {

            await authService.logoutAll(req.usuario.idUsuario);

            return ApiResponse.success(
                res,
                "Todas las sesiones fueron cerradas correctamente."
            );

        } catch (error) {

            next(error);

        }

    }

    static async me(req, res, next) {

        try {

            return ApiResponse.success(
                res,
                "Usuario autenticado.",
                {
                    usuario: req.usuario
                }
            );

        } catch (error) {

            next(error);

        }

    }

}