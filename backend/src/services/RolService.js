import BaseService from "./BaseService.js";
import AppError from "../utils/AppError.js";
import RolDTO from "../dto/RolDTO.js";
import rolRepository from "../repositories/RolRepository.js";

export default class RolService extends BaseService {

    async listar() {

        const roles = await this.repository.listar();

        return roles.map(rol => RolDTO.fromDatabase(rol));

    }

    async obtenerPorId(idRol) {

        const rol = await this.repository.obtenerPorId(idRol);

        if (!rol) {
            throw new AppError("Rol no encontrado.", 404);
        }

        return RolDTO.fromDatabase(rol);

    }

    async crear(data) {

        const existente = await this.repository.buscarPorNombre(data.nombre);

        if (existente) {
            throw new AppError("Ya existe un rol con ese nombre.", 409);
        }

        const resultado = await this.repository.crear({
            nombre: data.nombre,
            descripcion: data.descripcion || null,
            activo: data.activo ?? true
        });

        return await this.obtenerPorId(resultado.idRol);

    }

    async actualizar(idRol, data) {

        await this.obtenerPorId(idRol);

        const existente = await this.repository.buscarPorNombre(data.nombre);

        if (existente && existente.idRol !== idRol) {
            throw new AppError("Ya existe otro rol con ese nombre.", 409);
        }

        await this.repository.actualizar(idRol, {
            nombre: data.nombre,
            descripcion: data.descripcion || null,
            activo: data.activo ?? true
        });

        return await this.obtenerPorId(idRol);

    }

    async eliminar(idRol) {

        await this.obtenerPorId(idRol);

        await this.repository.eliminar(idRol);

        return true;

    }

}

export const rolService = new RolService(
    rolRepository
);