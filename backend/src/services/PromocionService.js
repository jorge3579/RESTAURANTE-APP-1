import BaseService from "./BaseService.js";
import AppError from "../utils/AppError.js";
import PromocionDTO from "../dto/PromocionDTO.js";

export default class PromocionService extends BaseService {

    async listar() {

        const promociones = await this.repository.listar();

        return promociones.map(PromocionDTO.fromDatabase);

    }

    async listarActivas() {

        const promociones = await this.repository.listarActivas();

        return promociones.map(PromocionDTO.fromDatabase);

    }

    async obtenerPorId(idPromocion) {

        const promocion = await this.repository.obtenerPorId(idPromocion);

        if (!promocion) {
            throw new AppError("Promoción no encontrada.", 404);
        }

        return PromocionDTO.fromDatabase(promocion);

    }

    async crear(data) {

        const resultado = await this.repository.crear({
            nombre: data.nombre,
            descripcion: data.descripcion || null,
            tipo: data.tipo,
            valor: data.valor,
            fechaInicio: data.fechaInicio,
            fechaFin: data.fechaFin,
            activa: data.activa ?? true,
            combinable: data.combinable ?? false
        });

        return await this.obtenerPorId(resultado.idPromocion);

    }

    async actualizar(idPromocion, data) {

        await this.obtenerPorId(idPromocion);

        await this.repository.actualizar(idPromocion, {
            nombre: data.nombre,
            descripcion: data.descripcion || null,
            tipo: data.tipo,
            valor: data.valor,
            fechaInicio: data.fechaInicio,
            fechaFin: data.fechaFin,
            activa: data.activa ?? true,
            combinable: data.combinable ?? false
        });

        return await this.obtenerPorId(idPromocion);

    }

    async eliminar(idPromocion) {

        await this.obtenerPorId(idPromocion);

        await this.repository.eliminar(idPromocion);

        return true;

    }

}