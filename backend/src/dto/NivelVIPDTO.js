export default class NivelVIPDTO {

    static fromDatabase(nivel) {

        if (!nivel) {
            return null;
        }

        return {
            idNivelVIP: nivel.idNivelVIP,
            nombre: nivel.nombre,
            comprasMinimas: nivel.comprasMinimas,
            descuentoPorcentaje: Number(nivel.descuentoPorcentaje),
            activo: nivel.activo,
            fechaCreacion: nivel.fechaCreacion
        };

    }

}