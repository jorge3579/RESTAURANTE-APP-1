import ApiResponse from "../helpers/ApiResponse.js";
import { fidelizacionService } from "../services/index.js";

export default class FidelizacionController {

    static async listarNivelesVIP(req, res, next) {

        try {

            const niveles = await fidelizacionService.listarNivelesVIP();

            return ApiResponse.success(
                res,
                "Niveles VIP obtenidos correctamente.",
                niveles
            );

        } catch (error) {

            next(error);

        }

    }

    static async misPuntos(req, res, next) {

        try {

            const puntos = await fidelizacionService.obtenerPuntosUsuario(
                req.usuario.idUsuario
            );

            return ApiResponse.success(
                res,
                "Puntos del usuario obtenidos correctamente.",
                puntos
            );

        } catch (error) {

            next(error);

        }

    }

    static async puntosUsuario(req, res, next) {

        try {

            const { idUsuario } = req.params;

            const puntos = await fidelizacionService.obtenerPuntosUsuario(
                Number(idUsuario)
            );

            return ApiResponse.success(
                res,
                "Puntos del usuario obtenidos correctamente.",
                puntos
            );

        } catch (error) {

            next(error);

        }

    }

    static async sumarCompra(req, res, next) {

        try {

            const resultado = await fidelizacionService.sumarCompra(
                Number(req.body.idUsuario),
                req.body.idPedido ? Number(req.body.idPedido) : null,
                Number(req.body.totalPedido)
            );

            return ApiResponse.success(
                res,
                "Puntos sumados correctamente.",
                resultado
            );

        } catch (error) {

            next(error);

        }

    }

    static async canjearPremio(req, res, next) {

        try {

            const resultado = await fidelizacionService.canjearPremio(
                req.usuario.idUsuario
            );

            return ApiResponse.success(
                res,
                "Premio canjeado correctamente.",
                resultado
            );

        } catch (error) {

            next(error);

        }

    }

    static async historial(req, res, next) {

        try {

            const historial = await fidelizacionService.listarHistorial(
                req.usuario.idUsuario
            );

            return ApiResponse.success(
                res,
                "Historial de puntos obtenido correctamente.",
                historial
            );

        } catch (error) {

            next(error);

        }

    }

}