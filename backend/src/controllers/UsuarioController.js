import ApiResponse from "../helpers/ApiResponse.js";

import { usuarioService } from "../services/index.js";

export default class UsuarioController {

    static async listar(req, res, next) {

        try {

            const usuarios = await usuarioService.listar();

            return ApiResponse.success(
                res,
                "Usuarios obtenidos correctamente.",
                usuarios
            );

        } catch (error) {

            next(error);

        }

    }

    static async obtenerPorId(req, res, next) {

        try {

            const { idUsuario } = req.params;

            const usuario = await usuarioService.obtenerPorId(
                Number(idUsuario)
            );

            return ApiResponse.success(
                res,
                "Usuario obtenido correctamente.",
                usuario
            );

        } catch (error) {

            next(error);

        }

    }

    static async crear(req, res, next) {

        try {

            const usuario = await usuarioService.crear(req.body);

            return ApiResponse.created(
                res,
                "Usuario creado correctamente.",
                usuario
            );

        } catch (error) {

            next(error);

        }

    }

    static async actualizar(req, res, next) {

        try {

            const { idUsuario } = req.params;

            const usuario = await usuarioService.actualizar(
                Number(idUsuario),
                req.body
            );

            return ApiResponse.success(
                res,
                "Usuario actualizado correctamente.",
                usuario
            );

        } catch (error) {

            next(error);

        }

    }

    static async cambiarPassword(req, res, next) {

        try {

            const { idUsuario } = req.params;

            await usuarioService.cambiarPassword(
                Number(idUsuario),
                req.body
            );

            return ApiResponse.success(
                res,
                "Contraseña actualizada correctamente."
            );

        } catch (error) {

            next(error);

        }

    }

    static async eliminar(req, res, next) {

        try {

            const { idUsuario } = req.params;

            await usuarioService.eliminar(
                Number(idUsuario)
            );

            return ApiResponse.success(
                res,
                "Usuario desactivado correctamente."
            );

        } catch (error) {

            next(error);

        }

    }

}
