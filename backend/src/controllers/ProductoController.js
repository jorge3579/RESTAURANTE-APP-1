import ApiResponse from "../helpers/ApiResponse.js";
import { productoService } from "../services/index.js";

export default class ProductoController {

    static async subirImagen(req, res, next) {
        try {
            if (!req.file) {
                return res.status(400).json({ success: false, message: "Seleccione una imagen." });
            }

            return ApiResponse.created(
                res,
                "Imagen cargada correctamente.",
                { imagenUrl: `/imagenes-productos/${req.file.filename}` }
            );
        } catch (error) {
            next(error);
        }
    }

    static async listar(req, res, next) {

        try {

            const productos = await productoService.listar();

            return ApiResponse.success(
                res,
                "Productos obtenidos correctamente.",
                productos
            );

        } catch (error) {

            next(error);

        }

    }

    static async listarDisponibles(req, res, next) {

        try {

            const productos = await productoService.listarDisponibles();

            return ApiResponse.success(
                res,
                "Productos disponibles obtenidos correctamente.",
                productos
            );

        } catch (error) {

            next(error);

        }

    }

    static async listarPorCategoria(req, res, next) {

        try {

            const { idCategoria } = req.params;

            const productos = await productoService.listarPorCategoria(
                Number(idCategoria)
            );

            return ApiResponse.success(
                res,
                "Productos por categoría obtenidos correctamente.",
                productos
            );

        } catch (error) {

            next(error);

        }

    }

    static async obtenerPorId(req, res, next) {

        try {

            const { idProducto } = req.params;

            const producto = await productoService.obtenerPorId(
                Number(idProducto)
            );

            return ApiResponse.success(
                res,
                "Producto obtenido correctamente.",
                producto
            );

        } catch (error) {

            next(error);

        }

    }

    static async crear(req, res, next) {

        try {

            const producto = await productoService.crear(req.body);

            return ApiResponse.created(
                res,
                "Producto creado correctamente.",
                producto
            );

        } catch (error) {

            next(error);

        }

    }

    static async actualizar(req, res, next) {

        try {

            const { idProducto } = req.params;

            const producto = await productoService.actualizar(
                Number(idProducto),
                req.body
            );

            return ApiResponse.success(
                res,
                "Producto actualizado correctamente.",
                producto
            );

        } catch (error) {

            next(error);

        }

    }

    static async eliminar(req, res, next) {

        try {

            const { idProducto } = req.params;

            await productoService.eliminar(
                Number(idProducto)
            );

            return ApiResponse.success(
                res,
                "Producto desactivado correctamente."
            );

        } catch (error) {

            next(error);

        }

    }

}
