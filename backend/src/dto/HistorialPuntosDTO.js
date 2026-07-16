export default class HistorialPuntosDTO {

    static fromDatabase(historial) {

        if (!historial) {
            return null;
        }

        return {
            idHistorialPuntos: historial.idHistorialPuntos,
            idUsuario: historial.idUsuario,
            cliente: historial.cliente || null,
            idPedido: historial.idPedido,
            puntos: historial.puntos,
            tipoMovimiento: historial.tipoMovimiento,
            descripcion: historial.descripcion,
            fechaCreacion: historial.fechaCreacion
        };

    }

}