import ApiResponse from "../helpers/ApiResponse.js";
import { categoriaService } from "../services/index.js";

export default class CategoriaController {

    static async listar(req, res, next) {

        try {

            const categorias = await categoriaService.listar();

            return ApiResponse.success(
                res,
                "Categorías obtenidas correctamente.",
                categorias
            );

        } catch (error) {

            next(error);

        }

    }

    static async obtenerPorId(req, res, next) {

        try {

            const { idCategoria } = req.params;

            const categoria = await categoriaService.obtenerPorId(
                Number(idCategoria)
            );

            return ApiResponse.success(
                res,
                "Categoría obtenida correctamente.",
                categoria
            );

        } catch (error) {

            next(error);

        }

    }

    static async crear(req, res, next) {

        try {

            const categoria = await categoriaService.crear(req.body);

            return ApiResponse.created(
                res,
                "Categoría creada correctamente.",
                categoria
            );

        } catch (error) {

            next(error);

        }

    }

    static async actualizar(req, res, next) {

        try {

            const { idCategoria } = req.params;

            const categoria = await categoriaService.actualizar(
                Number(idCategoria),
                req.body
            );

            return ApiResponse.success(
                res,
                "Categoría actualizada correctamente.",
                categoria
            );

        } catch (error) {

            next(error);

        }

    }

    static async eliminar(req, res, next) {

        try {

            const { idCategoria } = req.params;

            await categoriaService.eliminar(
                Number(idCategoria)
            );

            return ApiResponse.success(
                res,
                "Categoría desactivada correctamente."
            );

        } catch (error) {

            next(error);

        }

    }

}