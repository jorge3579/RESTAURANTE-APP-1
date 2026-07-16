import ApiResponse from "../helpers/ApiResponse.js";

import {
    configuracionSistemaService
} from "../services/index.js";

export default class ConfiguracionSistemaController {

    static async listar(req, res, next) {

        try {

            const configuraciones =
                await configuracionSistemaService.listar();

            return ApiResponse.success(
                res,
                "Configuraciones obtenidas correctamente.",
                configuraciones
            );

        } catch (error) {

            next(error);

        }

    }

    static async obtenerPorClave(req, res, next) {

        try {

            const configuracion =
                await configuracionSistemaService.obtenerPorClave(
                    req.params.clave
                );

            return ApiResponse.success(
                res,
                "Configuración obtenida correctamente.",
                configuracion
            );

        } catch (error) {

            next(error);

        }

    }

    static async actualizar(req, res, next) {

        try {

            const configuracion =
                await configuracionSistemaService.actualizar(
                    req.params.clave,
                    req.body.valor
                );

            return ApiResponse.success(
                res,
                "Configuración actualizada correctamente.",
                configuracion
            );

        } catch (error) {

            next(error);

        }

    }

}