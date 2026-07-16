import BaseService from "./BaseService.js";
import AppError from "../utils/AppError.js";
import PagoDTO from "../dto/PagoDTO.js";
import ESTADO_PAGO from "../constants/estadoPago.js";

export default class PagoService extends BaseService {

    async listar() {

        const pagos = await this.repository.listar();

        return pagos.map(PagoDTO.fromDatabase);

    }

    async obtenerPorId(idPago) {

        const pago = await this.repository.obtenerPorId(idPago);

        if (!pago) {
            throw new AppError("Pago no encontrado.", 404);
        }

        return PagoDTO.fromDatabase(pago);

    }

    async listarPorPedido(idPedido) {

        const pagos = await this.repository.listarPorPedido(idPedido);

        return pagos.map(PagoDTO.fromDatabase);

    }

    async crear(idUsuario, data) {

        const resultado = await this.repository.crear({
            idPedido: data.idPedido,
            idUsuario,
            metodoPago: data.metodoPago,
            proveedor: data.proveedor || null,
            referenciaExterna: data.referenciaExterna || null,
            monto: data.monto,
            estado: ESTADO_PAGO.PENDIENTE,
            fechaPago: null
        });

        return await this.obtenerPorId(resultado.idPago);

    }

    async aprobar(idPago, referenciaExterna = null) {

        await this.obtenerPorId(idPago);

        await this.repository.actualizarEstado(
            idPago,
            ESTADO_PAGO.APROBADO,
            referenciaExterna
        );

        return await this.obtenerPorId(idPago);

    }

    async rechazar(idPago, referenciaExterna = null) {

        await this.obtenerPorId(idPago);

        await this.repository.actualizarEstado(
            idPago,
            ESTADO_PAGO.RECHAZADO,
            referenciaExterna
        );

        return await this.obtenerPorId(idPago);

    }

    async cancelar(idPago) {

        await this.obtenerPorId(idPago);

        await this.repository.actualizarEstado(
            idPago,
            ESTADO_PAGO.CANCELADO
        );

        return await this.obtenerPorId(idPago);

    }

}