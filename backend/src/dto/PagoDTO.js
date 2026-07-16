export default class PagoDTO {

    static fromDatabase(pago) {

        if (!pago) {
            return null;
        }

        return {
            idPago: pago.idPago,
            idPedido: pago.idPedido,
            idUsuario: pago.idUsuario,
            cliente: pago.cliente || null,
            metodoPago: pago.metodoPago,
            proveedor: pago.proveedor,
            referenciaExterna: pago.referenciaExterna,
            monto: Number(pago.monto),
            estado: pago.estado,
            fechaPago: pago.fechaPago,
            fechaCreacion: pago.fechaCreacion,
            fechaModificacion: pago.fechaModificacion
        };

    }

}