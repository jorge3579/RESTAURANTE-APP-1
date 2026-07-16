import ApiResponse from "../helpers/ApiResponse.js";
import { promocionService } from "../services/index.js";

export default class PromocionController {

    static async listar(req, res, next) {

        try {

            const promociones = await promocionService.listar();

            return ApiResponse.success(
                res,
                "Promociones obtenidas correctamente.",
                promociones
            );

        } catch (error) {

            next(error);

        }

    }

    static async listarActivas(req, res, next) {

        try {

            const promociones = await promocionService.listarActivas();

            return ApiResponse.success(
                res,
                "Promociones activas obtenidas correctamente.",
                promociones
            );

        } catch (error) {

            next(error);

        }

    }

    static async obtenerPorId(req, res, next) {

        try {

            const { idPromocion } = req.params;

            const promocion = await promocionService.obtenerPorId(
                Number(idPromocion)
            );

            return ApiResponse.success(
                res,
                "Promoción obtenida correctamente.",
                promocion
            );

        } catch (error) {

            next(error);

        }

    }

    static async crear(req, res, next) {

        try {

            const promocion = await promocionService.crear(req.body);

            return ApiResponse.created(
                res,
                "Promoción creada correctamente.",
                promocion
            );

        } catch (error) {

            next(error);

        }

    }

    static async actualizar(req, res, next) {

        try {

            const { idPromocion } = req.params;

            const promocion = await promocionService.actualizar(
                Number(idPromocion),
                req.body
            );

            return ApiResponse.success(
                res,
                "Promoción actualizada correctamente.",
                promocion
            );

        } catch (error) {

            next(error);

        }

    }

    static async eliminar(req, res, next) {

        try {

            const { idPromocion } = req.params;

            await promocionService.eliminar(Number(idPromocion));

            return ApiResponse.success(
                res,
                "Promoción desactivada correctamente."
            );

        } catch (error) {

            next(error);

        }

    }

}