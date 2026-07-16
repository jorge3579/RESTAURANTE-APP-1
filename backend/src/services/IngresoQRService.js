import crypto from "crypto";

import BaseService from "./BaseService.js";
import AppError from "../utils/AppError.js";
import ESTADO_QR from "../constants/estadoQR.js";
import IngresoQRDTO from "../dto/IngresoQRDTO.js";

export default class IngresoQRService extends BaseService {

    generarCodigo() {

        return crypto.randomUUID();

    }

    async obtenerPorId(idIngresoQR) {

        const qr = await this.repository.obtenerPorId(idIngresoQR);

        if (!qr) {
            throw new AppError("QR no encontrado.", 404);
        }

        return IngresoQRDTO.fromDatabase(qr);

    }

    async generarQR(idReserva) {

        const existente = await this.repository.obtenerPorReserva(idReserva);

        if (existente) {
            return IngresoQRDTO.fromDatabase(existente);
        }

        const codigo = this.generarCodigo();

        const resultado = await this.repository.crear({
            idReserva,
            codigoQR: codigo,
            estado: ESTADO_QR.GENERADO,
            dispositivo: null,
            ip: null,
            observaciones: null
        });

        return await this.obtenerPorId(resultado.idIngresoQR);

    }

    async validarIngreso(codigoQR, dispositivo, ip) {

        const qr = await this.repository.obtenerPorCodigo(codigoQR);

        if (!qr) {
            throw new AppError("QR inexistente.", 404);
        }

        if (qr.estado !== ESTADO_QR.GENERADO) {
            throw new AppError(
                "El QR ya fue utilizado o se encuentra vencido.",
                400
            );
        }

        await this.repository.registrarEscaneo(
            codigoQR,
            dispositivo || null,
            ip || null
        );

        return IngresoQRDTO.fromDatabase(
            await this.repository.obtenerPorCodigo(codigoQR)
        );

    }

}