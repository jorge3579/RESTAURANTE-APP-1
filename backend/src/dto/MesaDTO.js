export default class MesaDTO {

    static fromDatabase(mesa) {

        if (!mesa) {

            return null;

        }

        return {

            idMesa: mesa.idMesa,

            idSucursal: mesa.idSucursal,

            numero: mesa.numero,

            capacidad: mesa.capacidad,

            ubicacion: mesa.ubicacion,

            estado: mesa.estado,

            activa: mesa.activa,

            fechaCreacion: mesa.fechaCreacion,

            fechaModificacion: mesa.fechaModificacion

        };

    }

}