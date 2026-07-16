export default class PedidoDetalleDTO {

    static fromDatabase(detalle) {

        if (!detalle) {
            return null;
        }

        return {
            idPedidoDetalle: detalle.idPedidoDetalle,
            idPedido: detalle.idPedido,
            idProducto: detalle.idProducto,
            producto: detalle.producto || null,
            cantidad: detalle.cantidad,
            precioUnitario: Number(detalle.precioUnitario),
            subtotal: Number(detalle.subtotal),
            observaciones: detalle.observaciones,
            fechaCreacion: detalle.fechaCreacion
        };

    }

}