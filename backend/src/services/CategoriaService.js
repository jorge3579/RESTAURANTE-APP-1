import BaseService from "./BaseService.js";
import AppError from "../utils/AppError.js";
import CategoriaDTO from "../dto/CategoriaDTO.js";

export default class CategoriaService extends BaseService {

    async listar() {

        const categorias = await this.repository.listar();

        return categorias.map(CategoriaDTO.fromDatabase);

    }

    async obtenerPorId(idCategoria) {

        const categoria = await this.repository.obtenerPorId(idCategoria);

        if (!categoria) {
            throw new AppError("Categoría no encontrada.", 404);
        }

        return CategoriaDTO.fromDatabase(categoria);

    }

    async crear(data) {

        const resultado = await this.repository.crear({
            nombre: data.nombre,
            descripcion: data.descripcion || null,
            activa: data.activa ?? true
        });

        return await this.obtenerPorId(resultado.idCategoria);

    }

    async actualizar(idCategoria, data) {

        await this.obtenerPorId(idCategoria);

        await this.repository.actualizar(idCategoria, {
            nombre: data.nombre,
            descripcion: data.descripcion || null,
            activa: data.activa ?? true
        });

        return await this.obtenerPorId(idCategoria);

    }

    async eliminar(idCategoria) {

        await this.obtenerPorId(idCategoria);

        await this.repository.eliminar(idCategoria);

        return true;

    }

}