import ApiResponse from "../helpers/ApiResponse.js";
import { reservaService } from "../services/index.js";

export default class ReservaController {

    static async listar(req, res, next) {

        try {

            const reservas = await reservaService.listar();

            return ApiResponse.success(
                res,
                "Reservas obtenidas correctamente.",
                reservas
            );

        } catch (error) {

            next(error);

        }

    }

    static async misReservas(req, res, next) {

        try {

            const reservas = await reservaService.listarPorUsuario(
                req.usuario.idUsuario
            );

            return ApiResponse.success(
                res,
                "Reservas del usuario obtenidas correctamente.",
                reservas
            );

        } catch (error) {

            next(error);

        }

    }

    static async obtenerPorId(req, res, next) {

        try {

            const { idReserva } = req.params;

            const reserva = await reservaService.obtenerPorId(
                Number(idReserva)
            );

            return ApiResponse.success(
                res,
                "Reserva obtenida correctamente.",
                reserva
            );

        } catch (error) {

            next(error);

        }

    }

    static async crear(req, res, next) {

        try {

            const reserva = await reservaService.crear(
                req.usuario.idUsuario,
                req.body
            );

            return ApiResponse.created(
                res,
                "Reserva creada correctamente.",
                reserva
            );

        } catch (error) {

            next(error);

        }

    }

    static async confirmar(req, res, next) {

        try {

            const { idReserva } = req.params;

            const reserva = await reservaService.confirmar(
                Number(idReserva)
            );

            return ApiResponse.success(
                res,
                "Reserva confirmada correctamente.",
                reserva
            );

        } catch (error) {

            next(error);

        }

    }

    static async cancelar(req, res, next) {

        try {

            const { idReserva } = req.params;

            const reserva = await reservaService.cancelar(
                Number(idReserva)
            );

            return ApiResponse.success(
                res,
                "Reserva cancelada correctamente.",
                reserva
            );

        } catch (error) {

            next(error);

        }

    }

    static async finalizar(req, res, next) {

        try {

            const { idReserva } = req.params;

            const reserva = await reservaService.finalizar(
                Number(idReserva)
            );

            return ApiResponse.success(
                res,
                "Reserva finalizada correctamente.",
                reserva
            );

        } catch (error) {

            next(error);

        }

    }

    static async marcarNoAsistio(req, res, next) {

        try {

            const { idReserva } = req.params;

            const reserva = await reservaService.marcarNoAsistio(
                Number(idReserva)
            );

            return ApiResponse.success(
                res,
                "Reserva marcada como no asistió.",
                reserva
            );

        } catch (error) {

            next(error);

        }

    }

}