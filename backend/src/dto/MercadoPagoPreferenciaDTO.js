export default class MercadoPagoPreferenciaDTO {

    static fromDatabase(preferencia) {

        if (!preferencia) {
            return null;
        }

        return {
            idPreferencia: preferencia.idPreferencia,
            idPedido: preferencia.idPedido,
            idPago: preferencia.idPago,
            preferenceId: preferencia.preferenceId,
            initPoint: preferencia.initPoint,
            sandboxInitPoint: preferencia.sandboxInitPoint,
            estado: preferencia.estado,
            fechaCreacion: preferencia.fechaCreacion,
            fechaModificacion: preferencia.fechaModificacion
        };

    }

}