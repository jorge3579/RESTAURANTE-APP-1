import BaseService from "./BaseService.js";
import AppError from "../utils/AppError.js";
import CreditoUsuarioDTO from "../dto/CreditoUsuarioDTO.js";

export default class CreditoUsuarioService extends BaseService {

    async listar() {

        const creditos = await this.repository.listar();

        return creditos.map(CreditoUsuarioDTO.fromDatabase);

    }

    async listarPorUsuario(idUsuario) {

        const creditos = await this.repository.listarPorUsuario(idUsuario);

        return creditos.map(CreditoUsuarioDTO.fromDatabase);

    }

    async obtenerPorId(idCredito) {

        const credito = await this.repository.obtenerPorId(idCredito);

        if (!credito) {
            throw new AppError("Crédito no encontrado.", 404);
        }

        return CreditoUsuarioDTO.fromDatabase(credito);

    }

    async crear(data) {

        const resultado = await this.repository.crear({
            idUsuario: data.idUsuario,
            idReserva: data.idReserva || null,
            monto: data.monto,
            saldo: data.monto,
            motivo: data.motivo
        });

        return await this.obtenerPorId(resultado.idCredito);

    }

    async consumir(idCredito, monto) {

        const credito = await this.obtenerPorId(idCredito);

        if (credito.saldo < monto) {
            throw new AppError(
                "Saldo insuficiente.",
                400
            );
        }

        const nuevoSaldo = credito.saldo - monto;

        await this.repository.consumir(
            idCredito,
            nuevoSaldo
        );

        return await this.obtenerPorId(idCredito);

    }

}