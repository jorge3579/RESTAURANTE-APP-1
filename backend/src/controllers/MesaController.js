import ApiResponse from "../helpers/ApiResponse.js";
import { mesaService } from "../services/index.js";

export default class MesaController {

    static async listar(req, res, next) {

        try {

            const mesas = await mesaService.listar();

            return ApiResponse.success(
                res,
                "Mesas obtenidas correctamente.",
                mesas
            );

        } catch (error) {

            next(error);

        }

    }

    static async listarPorSucursal(req, res, next) {

        try {

            const { idSucursal } = req.params;

            const mesas = await mesaService.listarPorSucursal(
                Number(idSucursal)
            );

            return ApiResponse.success(
                res,
                "Mesas de la sucursal obtenidas correctamente.",
                mesas
            );

        } catch (error) {

            next(error);

        }

    }

    static async obtenerPorId(req, res, next) {

        try {

            const { idMesa } = req.params;

            const mesa = await mesaService.obtenerPorId(
                Number(idMesa)
            );

            return ApiResponse.success(
                res,
                "Mesa obtenida correctamente.",
                mesa
            );

        } catch (error) {

            next(error);

        }

    }

    static async crear(req, res, next) {

        try {

            const mesa = await mesaService.crear(req.body);

            return ApiResponse.created(
                res,
                "Mesa creada correctamente.",
                mesa
            );

        } catch (error) {

            next(error);

        }

    }

    static async actualizar(req, res, next) {

        try {

            const { idMesa } = req.params;

            const mesa = await mesaService.actualizar(
                Number(idMesa),
                req.body
            );

            return ApiResponse.success(
                res,
                "Mesa actualizada correctamente.",
                mesa
            );

        } catch (error) {

            next(error);

        }

    }

    static async eliminar(req, res, next) {

        try {

            const { idMesa } = req.params;

            await mesaService.eliminar(
                Number(idMesa)
            );

            return ApiResponse.success(
                res,
                "Mesa desactivada correctamente."
            );

        } catch (error) {

            next(error);

        }

    }

}