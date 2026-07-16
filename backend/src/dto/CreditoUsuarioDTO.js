export default class CreditoUsuarioDTO {

    static fromDatabase(credito) {

        if (!credito) {
            return null;
        }

        return {
            idCredito: credito.idCredito,
            idUsuario: credito.idUsuario,
            cliente: credito.cliente || null,
            idReserva: credito.idReserva,
            monto: Number(credito.monto),
            saldo: Number(credito.saldo),
            motivo: credito.motivo,
            activo: credito.activo,
            fechaCreacion: credito.fechaCreacion,
            fechaModificacion: credito.fechaModificacion
        };

    }

}