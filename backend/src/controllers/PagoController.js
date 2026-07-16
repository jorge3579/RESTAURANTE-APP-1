import ApiResponse from "../helpers/ApiResponse.js";
import { pagoService } from "../services/index.js";

export default class PagoController {

    static async listar(req, res, next) {

        try {

            const pagos = await pagoService.listar();

            return ApiResponse.success(
                res,
                "Pagos obtenidos correctamente.",
                pagos
            );

        } catch (error) {

            next(error);

        }

    }

    static async obtenerPorId(req, res, next) {

        try {

            const { idPago } = req.params;

            const pago = await pagoService.obtenerPorId(
                Number(idPago)
            );

            return ApiResponse.success(
                res,
                "Pago obtenido correctamente.",
                pago
            );

        } catch (error) {

            next(error);

        }

    }

    static async listarPorPedido(req, res, next) {

        try {

            const { idPedido } = req.params;

            const pagos = await pagoService.listarPorPedido(
                Number(idPedido)
            );

            return ApiResponse.success(
                res,
                "Pagos del pedido obtenidos correctamente.",
                pagos
            );

        } catch (error) {

            next(error);

        }

    }

    static async crear(req, res, next) {

        try {

            const pago = await pagoService.crear(
                req.usuario.idUsuario,
                req.body
            );

            return ApiResponse.created(
                res,
                "Pago creado correctamente.",
                pago
            );

        } catch (error) {

            next(error);

        }

    }

    static async aprobar(req, res, next) {

        try {

            const { idPago } = req.params;

            const pago = await pagoService.aprobar(
                Number(idPago),
                req.body.referenciaExterna || null
            );

            return ApiResponse.success(
                res,
                "Pago aprobado correctamente.",
                pago
            );

        } catch (error) {

            next(error);

        }

    }

    static async rechazar(req, res, next) {

        try {

            const { idPago } = req.params;

            const pago = await pagoService.rechazar(
                Number(idPago),
                req.body.referenciaExterna || null
            );

            return ApiResponse.success(
                res,
                "Pago rechazado correctamente.",
                pago
            );

        } catch (error) {

            next(error);

        }

    }

    static async cancelar(req, res, next) {

        try {

            const { idPago } = req.params;

            const pago = await pagoService.cancelar(
                Number(idPago)
            );

            return ApiResponse.success(
                res,
                "Pago cancelado correctamente.",
                pago
            );

        } catch (error) {

            next(error);

        }

    }

}