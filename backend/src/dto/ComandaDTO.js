export default class ComandaDTO {

    static fromDatabase(comanda) {

        if (!comanda) {
            return null;
        }

        return {
            idComanda: comanda.idComanda,
            idPedido: comanda.idPedido,
            idSucursal: comanda.idSucursal,
            sucursal: comanda.sucursal || null,
            estado: comanda.estado,
            tiempoEstimadoMinutos: comanda.tiempoEstimadoMinutos,
            observaciones: comanda.observaciones,
            fechaInicio: comanda.fechaInicio,
            fechaFinalizacion: comanda.fechaFinalizacion,
            fechaCreacion: comanda.fechaCreacion,
            fechaModificacion: comanda.fechaModificacion
        };

    }

}