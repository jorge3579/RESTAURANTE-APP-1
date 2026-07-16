import ApiResponse from "../helpers/ApiResponse.js";
import { sucursalService } from "../services/index.js";

export default class SucursalController {

    static async listar(req, res, next) {

        try {

            const sucursales = await sucursalService.listar();

            return ApiResponse.success(
                res,
                "Sucursales obtenidas correctamente.",
                sucursales
            );

        } catch (error) {

            next(error);

        }

    }

    static async obtenerPorId(req, res, next) {

        try {

            const { idSucursal } = req.params;

            const sucursal = await sucursalService.obtenerPorId(
                Number(idSucursal)
            );

            return ApiResponse.success(
                res,
                "Sucursal obtenida correctamente.",
                sucursal
            );

        } catch (error) {

            next(error);

        }

    }

    static async crear(req, res, next) {

        try {

            const sucursal = await sucursalService.crear(req.body);

            return ApiResponse.created(
                res,
                "Sucursal creada correctamente.",
                sucursal
            );

        } catch (error) {

            next(error);

        }

    }

    static async actualizar(req, res, next) {

        try {

            const { idSucursal } = req.params;

            const sucursal = await sucursalService.actualizar(
                Number(idSucursal),
                req.body
            );

            return ApiResponse.success(
                res,
                "Sucursal actualizada correctamente.",
                sucursal
            );

        } catch (error) {

            next(error);

        }

    }

    static async eliminar(req, res, next) {

        try {

            const { idSucursal } = req.params;

            await sucursalService.eliminar(
                Number(idSucursal)
            );

            return ApiResponse.success(
                res,
                "Sucursal desactivada correctamente."
            );

        } catch (error) {

            next(error);

        }

    }

    static async listarHorarios(req, res, next) {
        try {
            const horarios = await sucursalService.listarHorarios(Number(req.params.idSucursal));
            return ApiResponse.success(res, "Horarios obtenidos correctamente.", horarios);
        } catch (error) {
            next(error);
        }
    }

    static async guardarHorarios(req, res, next) {
        try {
            const horarios = await sucursalService.guardarHorarios(
                Number(req.params.idSucursal),
                req.body.horarios
            );
            return ApiResponse.success(res, "Horarios actualizados correctamente.", horarios);
        } catch (error) {
            next(error);
        }
    }

}
