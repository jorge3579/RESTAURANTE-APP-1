export default class IngresoQRDTO {

    static fromDatabase(qr) {

        if (!qr) {

            return null;

        }

        return {

            idIngresoQR: qr.idIngresoQR,

            idReserva: qr.idReserva,

            codigoQR: qr.codigoQR,

            fechaGeneracion: qr.fechaGeneracion,

            fechaEscaneo: qr.fechaEscaneo,

            estado: qr.estado,

            dispositivo: qr.dispositivo,

            ip: qr.ip,

            observaciones: qr.observaciones

        };

    }

}