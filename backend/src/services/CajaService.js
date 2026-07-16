import BaseService from "./BaseService.js";
import AppError from "../utils/AppError.js";
import CajaDTO from "../dto/CajaDTO.js";

export default class CajaService extends BaseService {

    async listar() {

        const cajas = await this.repository.listar();

        return cajas.map(CajaDTO.fromDatabase);

    }

    async obtenerPorId(idCaja) {

        const caja = await this.repository.obtenerPorId(idCaja);

        if (!caja) {
            throw new AppError("Caja no encontrada.", 404);
        }

        return CajaDTO.fromDatabase(caja);

    }

    async abrir(data) {

        const abierta = await this.repository.obtenerCajaAbierta(
            data.idSucursal
        );

        if (abierta) {
            throw new AppError(
                "Ya existe una caja abierta para la sucursal.",
                400
            );
        }

        const resultado = await this.repository.abrir(data);

        return await this.obtenerPorId(
            resultado.idCaja
        );

    }

    async cerrar(data) {

        const caja = await this.obtenerPorId(
            data.idCaja
        );

        if (caja.estado === "CERRADA") {
            throw new AppError(
                "La caja ya está cerrada.",
                400
            );
        }

        await this.repository.cerrar(data);

        return await this.obtenerPorId(
            data.idCaja
        );

    }

}