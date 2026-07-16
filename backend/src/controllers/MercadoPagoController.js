import ApiResponse from "../helpers/ApiResponse.js";
import { mercadoPagoService } from "../services/index.js";

export default class MercadoPagoController {

    static async crearPreferencia(req, res, next) {

        try {

            const preferencia = await mercadoPagoService.crearPreferencia(
                req.usuario.idUsuario,
                req.body
            );

            return ApiResponse.created(
                res,
                "Preferencia de pago creada correctamente.",
                preferencia
            );

        } catch (error) {

            next(error);

        }

    }

    static async obtenerPorPedido(req, res, next) {

        try {

            const preferencia = await mercadoPagoService.obtenerPreferenciaPorPedido(
                Number(req.params.idPedido)
            );

            return ApiResponse.success(
                res,
                "Preferencia obtenida correctamente.",
                preferencia
            );

        } catch (error) {

            next(error);

        }

    }

    static async webhook(req, res, next) {

        try {

            const resultado = await mercadoPagoService.procesarWebhook(
                req.body
            );

            return ApiResponse.success(
                res,
                "Webhook recibido.",
                resultado
            );

        } catch (error) {

            next(error);

        }

    }

}