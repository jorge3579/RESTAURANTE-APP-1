import BaseService from "./BaseService.js";
import AppError from "../utils/AppError.js";
import ProductoDTO from "../dto/ProductoDTO.js";

export default class ProductoService extends BaseService {

    async listar() {

        const productos = await this.repository.listar();

        return productos.map(ProductoDTO.fromDatabase);

    }

    async listarDisponibles() {

        const productos = await this.repository.listarDisponibles();

        return productos.map(ProductoDTO.fromDatabase);

    }

    async listarPorCategoria(idCategoria) {

        const productos = await this.repository.listarPorCategoria(idCategoria);

        return productos.map(ProductoDTO.fromDatabase);

    }

    async obtenerPorId(idProducto) {

        const producto = await this.repository.obtenerPorId(idProducto);

        if (!producto) {
            throw new AppError("Producto no encontrado.", 404);
        }

        return ProductoDTO.fromDatabase(producto);

    }

    async crear(data) {

        const resultado = await this.repository.crear({
            idCategoria: data.idCategoria,
            nombre: data.nombre,
            descripcion: data.descripcion || null,
            precio: data.precio,
            imagenUrl: data.imagenUrl || null,
            disponible: data.disponible ?? true,
            activo: data.activo ?? true
        });

        return await this.obtenerPorId(resultado.idProducto);

    }

    async actualizar(idProducto, data) {

        await this.obtenerPorId(idProducto);

        await this.repository.actualizar(idProducto, {
            idCategoria: data.idCategoria,
            nombre: data.nombre,
            descripcion: data.descripcion || null,
            precio: data.precio,
            imagenUrl: data.imagenUrl || null,
            disponible: data.disponible ?? true,
            activo: data.activo ?? true
        });

        return await this.obtenerPorId(idProducto);

    }

    async eliminar(idProducto) {

        await this.obtenerPorId(idProducto);

        await this.repository.eliminar(idProducto);

        return true;

    }

}