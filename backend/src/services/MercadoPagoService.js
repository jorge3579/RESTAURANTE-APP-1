import BaseService from "./BaseService.js";
import AppError from "../utils/AppError.js";

import env from "../config/env.js";
import { mercadoPagoPreference, mercadoPagoPayment } from "../config/mercadoPago.js";

import MercadoPagoPreferenciaDTO from "../dto/MercadoPagoPreferenciaDTO.js";

import METODO_PAGO from "../constants/metodoPago.js";
import TIPO_NOTIFICACION from "../constants/tipoNotificacion.js";

import {
    pagoService,
    pedidoService,
    reservaService,
    ingresoQRService,
    fidelizacionService,
    notificacionService
} from "./index.js";

export default class MercadoPagoService extends BaseService {

    async crearPreferencia(idUsuario, data) {

        if (!env.mercadoPago.accessToken) {
            throw new AppError(
                "Mercado Pago todavía no está configurado. Agregue el access token para habilitar pagos.",
                503
            );
        }

        const pedido = await pedidoService.obtenerPorId(data.idPedido);

        const pago = await pagoService.crear(idUsuario, {
            idPedido: pedido.idPedido,
            metodoPago: METODO_PAGO.MERCADO_PAGO,
            proveedor: "Mercado Pago",
            referenciaExterna: null,
            monto: pedido.total
        });

        const preference = await mercadoPagoPreference.create({
            body: {
                items: [
                    {
                        title: `Pedido #${pedido.idPedido} - SmartRestaurantQR`,
                        quantity: 1,
                        currency_id: "ARS",
                        unit_price: Number(pedido.total)
                    }
                ],
                external_reference: String(pago.idPago),
                notification_url: env.mercadoPago.webhookUrl,
                back_urls: {
                    success: env.mercadoPago.successUrl,
                    failure: env.mercadoPago.failureUrl,
                    pending: env.mercadoPago.pendingUrl
                },
                auto_return: "approved"
            }
        });

        const resultado = await this.repository.guardarPreferencia({
            idPedido: pedido.idPedido,
            idPago: pago.idPago,
            preferenceId: preference.id,
            initPoint: preference.init_point || null,
            sandboxInitPoint: preference.sandbox_init_point || null,
            estado: "CREADA"
        });

        return MercadoPagoPreferenciaDTO.fromDatabase(
            await this.repository.obtenerPreferenciaPorId(resultado.idPreferencia)
        );

    }

    async obtenerPreferenciaPorPedido(idPedido) {

        const preferencia = await this.repository.obtenerPreferenciaPorPedido(idPedido);

        if (!preferencia) {
            throw new AppError("Preferencia de Mercado Pago no encontrada.", 404);
        }

        return MercadoPagoPreferenciaDTO.fromDatabase(preferencia);

    }

    async registrarWebhook(payload) {

        const tipo = payload.type || payload.topic || null;

        const accion = payload.action || null;

        const dataId = payload.data?.id || payload.id || null;

        const resultado = await this.repository.registrarWebhook({
            tipo,
            accion,
            dataId: dataId ? String(dataId) : null,
            payload: JSON.stringify(payload)
        });

        return resultado.idWebhook;

    }

    async procesarWebhook(payload) {

        const idWebhook = await this.registrarWebhook(payload);

        const tipo = payload.type || payload.topic;

        const dataId = payload.data?.id || payload.id;

        if (tipo !== "payment" || !dataId) {

            await this.repository.marcarWebhookProcesado(idWebhook);

            return {
                procesado: false,
                motivo: "Webhook ignorado."
            };

        }

        const payment = await mercadoPagoPayment.get({
            id: dataId
        });

        const idPago = Number(payment.external_reference);

        if (!idPago) {

            await this.repository.marcarWebhookProcesado(idWebhook);

            return {
                procesado: false,
                motivo: "Pago sin referencia externa."
            };

        }

        if (payment.status === "approved") {

            const pago = await pagoService.aprobar(
                idPago,
                String(payment.id)
            );

            const pedido = await pedidoService.obtenerPorId(
                pago.idPedido
            );

            if (pedido.idReserva) {

                await reservaService.confirmar(
                    pedido.idReserva
                );

                await ingresoQRService.generarQR(
                    pedido.idReserva
                );

            }

            await fidelizacionService.sumarCompra(
                pedido.idUsuario,
                pedido.idPedido,
                pedido.total
            );

            await notificacionService.crear({
                idUsuario: pedido.idUsuario,
                titulo: "Pago aprobado",
                mensaje: "Tu pago fue aprobado y tu reserva quedó confirmada.",
                tipo: TIPO_NOTIFICACION.PAGO
            });

        }

        if (payment.status === "rejected") {

            await pagoService.rechazar(
                idPago,
                String(payment.id)
            );

        }

        await this.repository.marcarWebhookProcesado(idWebhook);

        return {
            procesado: true
        };

    }

}
