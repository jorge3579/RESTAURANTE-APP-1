export default class PedidoDTO {

    static fromDatabase(pedido, detalles = []) {

        if (!pedido) {
            return null;
        }

        return {
            idPedido: pedido.idPedido,
            idReserva: pedido.idReserva,
            idUsuario: pedido.idUsuario,
            cliente: pedido.cliente || null,
            idSucursal: pedido.idSucursal,
            sucursal: pedido.sucursal || null,
            tipoConsumo: pedido.tipoConsumo,
            estado: pedido.estado,
            subtotal: Number(pedido.subtotal),
            descuento: Number(pedido.descuento),
            total: Number(pedido.total),
            observaciones: pedido.observaciones,
            fechaCreacion: pedido.fechaCreacion,
            fechaModificacion: pedido.fechaModificacion,
            detalles
        };

    }

}