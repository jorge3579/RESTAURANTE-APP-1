import ApiResponse from "../helpers/ApiResponse.js";
import { rolService } from "../services/index.js";

export default class RolController {

    static async listar(req, res, next) {

        try {

            const roles = await rolService.listar();

            return ApiResponse.success(
                res,
                "Roles obtenidos correctamente.",
                roles
            );

        } catch (error) {

            next(error);

        }

    }

    static async obtenerPorId(req, res, next) {

        try {

            const { idRol } = req.params;

            const rol = await rolService.obtenerPorId(Number(idRol));

            return ApiResponse.success(
                res,
                "Rol obtenido correctamente.",
                rol
            );

        } catch (error) {

            next(error);

        }

    }

    static async crear(req, res, next) {

        try {

            const rol = await rolService.crear(req.body);

            return ApiResponse.created(
                res,
                "Rol creado correctamente.",
                rol
            );

        } catch (error) {

            next(error);

        }

    }

    static async actualizar(req, res, next) {

        try {

            const { idRol } = req.params;

            const rol = await rolService.actualizar(
                Number(idRol),
                req.body
            );

            return ApiResponse.success(
                res,
                "Rol actualizado correctamente.",
                rol
            );

        } catch (error) {

            next(error);

        }

    }

    static async eliminar(req, res, next) {

        try {

            const { idRol } = req.params;

            await rolService.eliminar(Number(idRol));

            return ApiResponse.success(
                res,
                "Rol desactivado correctamente."
            );

        } catch (error) {

            next(error);

        }

    }

}