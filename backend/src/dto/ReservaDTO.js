export default class ReservaDTO {

    static fromDatabase(reserva) {

        if (!reserva) {
            return null;
        }

        return {
            idReserva: reserva.idReserva,
            idUsuario: reserva.idUsuario,
            cliente: reserva.cliente || null,
            idSucursal: reserva.idSucursal,
            sucursal: reserva.sucursal || null,
            idMesa: reserva.idMesa,
            mesa: reserva.mesa || null,
            fechaReserva: reserva.fechaReserva,
            horaReserva: reserva.horaReserva,
            cantidadPersonas: reserva.cantidadPersonas,
            estado: reserva.estado,
            observaciones: reserva.observaciones,
            codigoQR: reserva.codigoQR,
            fechaCreacion: reserva.fechaCreacion,
            fechaModificacion: reserva.fechaModificacion
        };

    }

}