import ApiResponse from "../helpers/ApiResponse.js";
import { permisoService } from "../services/index.js";

export default class PermisoController {

    static async listar(req, res, next) {

        try {

            const permisos = await permisoService.listar();

            return ApiResponse.success(
                res,
                "Permisos obtenidos correctamente.",
                permisos
            );

        } catch (error) {

            next(error);

        }

    }

    static async listarPorRol(req, res, next) {

        try {

            const { idRol } = req.params;

            const permisos = await permisoService.listarPorRol(
                Number(idRol)
            );

            return ApiResponse.success(
                res,
                "Permisos del rol obtenidos correctamente.",
                permisos
            );

        } catch (error) {

            next(error);

        }

    }

    static async asignarPermisosARol(req, res, next) {

        try {

            const { idRol } = req.params;

            const permisos = await permisoService.asignarPermisosARol(
                Number(idRol),
                req.body.permisos
            );

            return ApiResponse.success(
                res,
                "Permisos asignados correctamente.",
                permisos
            );

        } catch (error) {

            next(error);

        }

    }

}