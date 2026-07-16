import BaseService from "./BaseService.js";
import AppError from "../utils/AppError.js";
import PedidoDTO from "../dto/PedidoDTO.js";
import PedidoDetalleDTO from "../dto/PedidoDetalleDTO.js";
import ESTADO_PEDIDO from "../constants/estadoPedido.js";
import { getIO } from "../sockets/socketServer.js";

export default class PedidoService extends BaseService {

    constructor(repository, productoRepository, comandaService) {
        super(repository);
        this.productoRepository = productoRepository;
        this.comandaService = comandaService;
    }

    async listar() {
        const pedidos = await this.repository.listar();
        return pedidos.map((pedido) => PedidoDTO.fromDatabase(pedido));
    }

    async listarPorUsuario(idUsuario) {
        const pedidos = await this.repository.listarPorUsuario(idUsuario);
        return pedidos.map((pedido) => PedidoDTO.fromDatabase(pedido));
    }

    async obtenerPorId(idPedido) {

        const pedido =
            await this.repository.obtenerPorId(idPedido);

        if (!pedido) {
            throw new AppError(
                "Pedido no encontrado.",
                404
            );
        }

        const detalles = await this.repository.obtenerDetalles(idPedido);
        return PedidoDTO.fromDatabase(
            pedido,
            detalles.map(PedidoDetalleDTO.fromDatabase)
        );
    }

    async crear(idUsuario, data) {
        const detalles = [];

        for (const item of data.detalles) {
            const producto = await this.productoRepository.obtenerPorId(item.idProducto);
            if (!producto || !producto.activo || !producto.disponible) {
                throw new AppError("Uno de los productos no está disponible.", 409);
            }
            const cantidad = Number(item.cantidad);
            const precioUnitario = Number(producto.precio);
            detalles.push({
                idProducto: producto.idProducto,
                nombreProducto: producto.nombre,
                cantidad,
                precioUnitario,
                subtotal: precioUnitario * cantidad,
                observaciones: item.observaciones || null
            });
        }

        const subtotal = detalles.reduce((total, item) => total + item.subtotal, 0);
        const numeroPedido = `PED-${Date.now()}-${idUsuario}`;

        const idPedido = await this.repository.databaseManager.transaction(async (transaction) => {
            const resultado = await this.repository.crear({
                idReserva: data.idReserva || null,
                idUsuario,
                idSucursal: data.idSucursal,
                numeroPedido,
                tipoConsumo: data.tipoConsumo,
                estado: ESTADO_PEDIDO.CONFIRMADO,
                subtotal,
                descuento: 0,
                total: subtotal,
                observaciones: data.observaciones || null
            }, transaction);

            for (const detalle of detalles) {
                await this.repository.agregarDetalle({
                    ...detalle,
                    idPedido: resultado.idPedido
                }, transaction);
            }
            return resultado.idPedido;
        });

        await this.comandaService.crear({
            idPedido,
            idSucursal: data.idSucursal,
            observaciones: data.observaciones || null
        });

        const pedidoCreado = await this.obtenerPorId(idPedido);

        try {
            const io = getIO();
            io.to(`sucursal-${data.idSucursal}`).emit("nuevoPedido", pedidoCreado);
        } catch (error) {
            console.error("Error al emitir socket nuevoPedido:", error.message);
        }

        return pedidoCreado;
    }

    async cambiarEstado(idPedido, estado) {
        await this.obtenerPorId(idPedido);
        await this.repository.actualizarEstado(idPedido, estado);
        return await this.obtenerPorId(idPedido);
    }

    async actualizar(idPedido, data) {

        await this.obtenerPorId(idPedido);

        await this.repository.actualizar(
            idPedido,
            data
        );

        return await this.obtenerPorId(idPedido);
    }

    async eliminar(idPedido) {

        await this.obtenerPorId(idPedido);

        await this.repository.eliminar(idPedido);

        return true;
    }

}
