import AppError from "../utils/AppError.js";
import UsuarioDTO from "../dto/UsuarioDTO.js";

import { generarHash, verificarPassword } from "../helpers/password.js";
import { generarAccessToken, generarRefreshToken } from "../helpers/jwt.js";

export default class AuthService {

    constructor(authRepository) {

        this.authRepository = authRepository;

    }

    calcularFechaExpiracionRefreshToken() {

        const fecha = new Date();

        fecha.setDate(fecha.getDate() + 30);

        return fecha;

    }

    async registrar(data) {

        const usuarioExistente = await this.authRepository.buscarUsuarioPorEmail(data.email);

        if (usuarioExistente) {
            throw new AppError("El email ya se encuentra registrado.", 409);
        }

        const rolCliente = await this.authRepository.buscarRolPorNombre("Cliente");

        if (!rolCliente) {
            throw new AppError("El rol Cliente no existe en la base de datos.", 500);
        }

        const passwordHash = await generarHash(data.password);

        const nuevoUsuario = {
            idRol: rolCliente.idRol,
            nombre: data.nombre,
            apellido: data.apellido,
            email: data.email,
            telefono: data.telefono || null,
            passwordHash
        };

        const resultado = await this.authRepository.crearUsuario(nuevoUsuario);

        const usuarioCreado = await this.authRepository.buscarUsuarioPorEmail(data.email);

        return {
            idUsuario: resultado.idUsuario,
            usuario: UsuarioDTO.fromDatabase(usuarioCreado)
        };

    }

    async login(data, metadata = {}) {

        const usuario = await this.authRepository.buscarUsuarioPorEmail(data.email);

        if (!usuario) {
            throw new AppError("Credenciales inválidas.", 401);
        }

        if (!usuario.activo) {
            throw new AppError("El usuario se encuentra desactivado.", 403);
        }

        const passwordValida = await verificarPassword(data.password, usuario.passwordHash);

        if (!passwordValida) {
            throw new AppError("Credenciales inválidas.", 401);
        }

        const accessToken = generarAccessToken(usuario);

        const refreshToken = generarRefreshToken();

        await this.authRepository.guardarRefreshToken({
            idUsuario: usuario.idUsuario,
            token: refreshToken,
            fechaExpiracion: this.calcularFechaExpiracionRefreshToken(),
            dispositivo: metadata.dispositivo || null,
            ip: metadata.ip || null
        });

        await this.authRepository.actualizarUltimoLogin(usuario.idUsuario);

        return {
            usuario: UsuarioDTO.fromDatabase(usuario),
            accessToken,
            refreshToken
        };

    }

    async refresh(token) {

        if (!token) {
            throw new AppError("Refresh token requerido.", 400);
        }

        const refreshToken = await this.authRepository.buscarRefreshToken(token);

        if (!refreshToken) {
            throw new AppError("Refresh token inválido.", 401);
        }

        if (refreshToken.revocado) {
            throw new AppError("Refresh token revocado.", 401);
        }

        if (new Date(refreshToken.fechaExpiracion) < new Date()) {
            throw new AppError("Refresh token expirado.", 401);
        }

        if (!refreshToken.activo) {
            throw new AppError("Usuario inactivo.", 403);
        }

        const usuario = {
            idUsuario: refreshToken.idUsuario,
            idRol: refreshToken.idRol,
            nombre: refreshToken.nombre,
            apellido: refreshToken.apellido,
            email: refreshToken.email
        };

        const accessToken = generarAccessToken(usuario);

        return {
            accessToken
        };

    }

    async logout(token) {

        if (!token) {
            throw new AppError("Refresh token requerido.", 400);
        }

        await this.authRepository.revocarRefreshToken(token);

        return true;

    }

    async logoutAll(idUsuario) {

        await this.authRepository.revocarTodosLosTokens(idUsuario);

        return true;

    }

}
