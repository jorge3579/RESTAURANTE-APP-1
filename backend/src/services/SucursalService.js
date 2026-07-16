import BaseService from "./BaseService.js";
import AppError from "../utils/AppError.js";
import SucursalDTO from "../dto/SucursalDTO.js";

export default class SucursalService extends BaseService {

    async listar() {

        const sucursales = await this.repository.listar();

        return sucursales.map(SucursalDTO.fromDatabase);

    }

    async obtenerPorId(idSucursal) {

        const sucursal = await this.repository.obtenerPorId(idSucursal);

        if (!sucursal) {
            throw new AppError("Sucursal no encontrada.", 404);
        }

        return SucursalDTO.fromDatabase(sucursal);

    }

    async crear(data) {

        const resultado = await this.repository.crear({
            nombre: data.nombre,
            direccion: data.direccion,
            telefono: data.telefono || null,
            email: data.email || null,
            ciudad: data.ciudad || null,
            provincia: data.provincia || null,
            activo: data.activo ?? true
        });

        return await this.obtenerPorId(resultado.idSucursal);

    }

    async actualizar(idSucursal, data) {

        await this.obtenerPorId(idSucursal);

        await this.repository.actualizar(idSucursal, {
            nombre: data.nombre,
            direccion: data.direccion,
            telefono: data.telefono || null,
            email: data.email || null,
            ciudad: data.ciudad || null,
            provincia: data.provincia || null,
            activo: data.activo ?? true
        });

        return await this.obtenerPorId(idSucursal);

    }

    async eliminar(idSucursal) {

        await this.obtenerPorId(idSucursal);

        await this.repository.eliminar(idSucursal);

        return true;

    }

    async listarHorarios(idSucursal) {
        await this.obtenerPorId(idSucursal);
        return await this.repository.listarHorarios(idSucursal);
    }

    async guardarHorarios(idSucursal, horarios) {
        await this.obtenerPorId(idSucursal);
        await this.repository.guardarHorarios(idSucursal, horarios);
        return await this.listarHorarios(idSucursal);
    }

}
