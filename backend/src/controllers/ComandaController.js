import ApiResponse from "../helpers/ApiResponse.js";
import { comandaService } from "../services/index.js";

export default class ComandaController {

    static async listar(req, res, next) {

        try {

            const comandas = await comandaService.listar();

            return ApiResponse.success(
                res,
                "Comandas obtenidas correctamente.",
                comandas
            );

        } catch (error) {

            next(error);

        }

    }

    static async listarPorSucursal(req, res, next) {

        try {

            const comandas = await comandaService.listarPorSucursal(
                Number(req.params.idSucursal)
            );

            return ApiResponse.success(
                res,
                "Comandas de la sucursal obtenidas correctamente.",
                comandas
            );

        } catch (error) {

            next(error);

        }

    }

    static async obtenerPorId(req, res, next) {

        try {

            const comanda = await comandaService.obtenerPorId(
                Number(req.params.idComanda)
            );

            return ApiResponse.success(
                res,
                "Comanda obtenida correctamente.",
                comanda
            );

        } catch (error) {

            next(error);

        }

    }

    static async crear(req, res, next) {

        try {

            const comanda = await comandaService.crear(req.body);

            return ApiResponse.created(
                res,
                "Comanda creada correctamente.",
                comanda
            );

        } catch (error) {

            next(error);

        }

    }

    static async cambiarEstado(req, res, next) {

        try {

            const comanda = await comandaService.cambiarEstado(
                Number(req.params.idComanda),
                req.body.estado,
                req.body.tiempoEstimadoMinutos || null
            );

            return ApiResponse.success(
                res,
                "Estado de comanda actualizado correctamente.",
                comanda
            );

        } catch (error) {

            next(error);

        }

    }

}