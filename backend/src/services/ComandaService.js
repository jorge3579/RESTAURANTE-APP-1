import BaseService from "./BaseService.js";
import AppError from "../utils/AppError.js";
import ComandaDTO from "../dto/ComandaDTO.js";
import ESTADO_COMANDA from "../constants/estadoComanda.js";

import {
    emitirNuevaComanda,
    emitirCambioEstadoComanda
} from "../helpers/socketEvents.js";

export default class ComandaService extends BaseService {

    constructor(repository, pedidoRepository) {
        super(repository);
        this.pedidoRepository = pedidoRepository;
    }

    async listar() {

        const comandas = await this.repository.listar();

        return comandas.map(ComandaDTO.fromDatabase);

    }

    async listarPorSucursal(idSucursal) {

        const comandas = await this.repository.listarPorSucursal(idSucursal);

        return comandas.map(ComandaDTO.fromDatabase);

    }

    async obtenerPorId(idComanda) {

        const comanda = await this.repository.obtenerPorId(idComanda);

        if (!comanda) {
            throw new AppError("Comanda no encontrada.", 404);
        }

        return ComandaDTO.fromDatabase(comanda);

    }

    async crear(data) {

        const existente = await this.repository.obtenerPorPedido(data.idPedido);

        if (existente) {
            return ComandaDTO.fromDatabase(existente);
        }

        const resultado = await this.repository.crear({
            idPedido: data.idPedido,
            idSucursal: data.idSucursal,
            estado: ESTADO_COMANDA.PENDIENTE,
            tiempoEstimadoMinutos: data.tiempoEstimadoMinutos || null,
            observaciones: data.observaciones || null
        });

        const comanda = await this.obtenerPorId(resultado.idComanda);

        emitirNuevaComanda(
            comanda.idSucursal,
            comanda
        );

        return comanda;

    }

    async cambiarEstado(idComanda, estado, tiempoEstimadoMinutos = null) {

        await this.obtenerPorId(idComanda);

        await this.repository.cambiarEstado(
            idComanda,
            estado,
            tiempoEstimadoMinutos
        );

        const estadoPedido = {
            EN_PREPARACION: "EN_PREPARACION",
            LISTA: "LISTO",
            ENTREGADA: "ENTREGADO",
            CANCELADA: "CANCELADO"
        }[estado];

        if (estadoPedido) {
            const comandaActual = await this.repository.obtenerPorId(idComanda);
            await this.pedidoRepository.actualizarEstado(comandaActual.idPedido, estadoPedido);
        }

        const comanda = await this.obtenerPorId(idComanda);

        emitirCambioEstadoComanda(
            comanda.idSucursal,
            comanda
        );

        return comanda;

    }

}
