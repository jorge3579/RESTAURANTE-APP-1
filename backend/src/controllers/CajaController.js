import ApiResponse from "../helpers/ApiResponse.js";

import {
    cajaService
} from "../services/index.js";

export default class CajaController {

    static async listar(req, res, next) {

        try {

            const resultado =
                await cajaService.listar();

            return ApiResponse.success(
                res,
                "Cajas obtenidas correctamente.",
                resultado
            );

        } catch (error) {

            next(error);

        }

    }

    static async abrir(req, res, next) {

        try {

            const resultado =
                await cajaService.abrir({

                    idSucursal: req.body.idSucursal,

                    idUsuarioApertura: req.usuario.idUsuario,

                    montoInicial: req.body.montoInicial,

                    observaciones: req.body.observaciones || null

                });

            return ApiResponse.created(
                res,
                "Caja abierta correctamente.",
                resultado
            );

        } catch (error) {

            next(error);

        }

    }

    static async cerrar(req, res, next) {

        try {

            const resultado =
                await cajaService.cerrar({

                    idCaja: Number(req.params.idCaja),

                    idUsuarioCierre: req.usuario.idUsuario,

                    montoFinal: req.body.montoFinal,

                    observaciones: req.body.observaciones || null

                });

            return ApiResponse.success(
                res,
                "Caja cerrada correctamente.",
                resultado
            );

        } catch (error) {

            next(error);

        }

    }

}