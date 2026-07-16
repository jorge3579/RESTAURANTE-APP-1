import BaseService from "./BaseService.js";
import AppError from "../utils/AppError.js";
import ConfiguracionSistemaDTO from "../dto/ConfiguracionSistemaDTO.js";

export default class ConfiguracionSistemaService extends BaseService {

    async listar() {

        const configuraciones = await this.repository.listar();

        return configuraciones.map(
            ConfiguracionSistemaDTO.fromDatabase
        );

    }

    async obtenerPorClave(clave) {

        const configuracion = await this.repository.obtenerPorClave(clave);

        if (!configuracion) {
            throw new AppError("Configuración no encontrada.", 404);
        }

        return ConfiguracionSistemaDTO.fromDatabase(configuracion);

    }

    async actualizar(clave, valor) {

        const configuracion = await this.repository.obtenerPorClave(clave);

        if (!configuracion) {
            throw new AppError("Configuración no encontrada.", 404);
        }

        if (!configuracion.editable) {
            throw new AppError("Esta configuración no es editable.", 403);
        }

        await this.repository.actualizar(clave, valor);

        return await this.obtenerPorClave(clave);

    }

}