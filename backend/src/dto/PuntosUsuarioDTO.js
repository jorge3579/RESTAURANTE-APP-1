export default class PuntosUsuarioDTO {

    static fromDatabase(puntos) {

        if (!puntos) {
            return null;
        }

        return {
            idPuntosUsuario: puntos.idPuntosUsuario,
            idUsuario: puntos.idUsuario,
            cliente: puntos.cliente || null,
            puntos: puntos.puntos,
            comprasAcumuladas: puntos.comprasAcumuladas,
            idNivelVIP: puntos.idNivelVIP,
            nivelVIP: puntos.nivelVIP || null,
            descuentoPorcentaje: puntos.descuentoPorcentaje !== undefined
                ? Number(puntos.descuentoPorcentaje)
                : null,
            fechaCreacion: puntos.fechaCreacion,
            fechaModificacion: puntos.fechaModificacion
        };

    }

}