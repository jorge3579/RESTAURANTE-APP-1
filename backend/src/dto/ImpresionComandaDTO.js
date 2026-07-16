export default class ImpresionComandaDTO {

    static fromDatabase(data) {

        if (!data) {

            return null;

        }

        return {

            idImpresion: data.idImpresion,

            idComanda: data.idComanda,

            tipo: data.tipo,

            impresora: data.impresora,

            copias: data.copias,

            estado: data.estado,

            fechaImpresion: data.fechaImpresion,

            error: data.error,

            fechaCreacion: data.fechaCreacion,

            fechaModificacion: data.fechaModificacion

        };

    }

}