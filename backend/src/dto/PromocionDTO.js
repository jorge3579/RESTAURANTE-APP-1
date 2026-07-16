export default class PromocionDTO {

    static fromDatabase(promocion) {

        if (!promocion) {
            return null;
        }

        return {
            idPromocion: promocion.idPromocion,
            nombre: promocion.nombre,
            descripcion: promocion.descripcion,
            tipo: promocion.tipo,
            valor: Number(promocion.valor),
            fechaInicio: promocion.fechaInicio,
            fechaFin: promocion.fechaFin,
            activa: promocion.activa,
            combinable: promocion.combinable,
            fechaCreacion: promocion.fechaCreacion,
            fechaModificacion: promocion.fechaModificacion
        };

    }

}