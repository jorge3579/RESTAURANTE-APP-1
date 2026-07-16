import BaseService from "./BaseService.js";
import AppError from "../utils/AppError.js";
import UsuarioDTO from "../dto/UsuarioDTO.js";
import { generarHash } from "../helpers/password.js";

export default class UsuarioService extends BaseService {

    async listar() {

        const usuarios = await this.repository.listar();

        return usuarios.map(UsuarioDTO.fromDatabase);

    }

    async obtenerPorId(idUsuario) {

        const usuario = await this.repository.obtenerPorId(idUsuario);

        if (!usuario) {
            throw new AppError("Usuario no encontrado.", 404);
        }

        return UsuarioDTO.fromDatabase(usuario);

    }

    async crear(data) {

        const existente = await this.repository.buscarPorEmail(data.email);

        if (existente) {
            throw new AppError("El email ya se encuentra registrado.", 409);
        }

        const passwordHash = await generarHash(data.password);

        const resultado = await this.repository.crear({
            idRol: data.idRol,
            nombre: data.nombre,
            apellido: data.apellido,
            email: data.email,
            telefono: data.telefono || null,
            passwordHash,
            activo: data.activo ?? true
        });

        return await this.obtenerPorId(resultado.idUsuario);

    }

    async actualizar(idUsuario, data) {

        await this.obtenerPorId(idUsuario);

        await this.repository.actualizar(idUsuario, {
            idRol: data.idRol,
            nombre: data.nombre,
            apellido: data.apellido,
            telefono: data.telefono || null,
            activo: data.activo ?? true
        });

        return await this.obtenerPorId(idUsuario);

    }

    async cambiarPassword(idUsuario, data) {

        await this.obtenerPorId(idUsuario);

        const passwordHash = await generarHash(data.password);

        await this.repository.cambiarPassword(idUsuario, passwordHash);

        return true;

    }

    async eliminar(idUsuario) {

        await this.obtenerPorId(idUsuario);

        await this.repository.eliminar(idUsuario);

        return true;

    }

}