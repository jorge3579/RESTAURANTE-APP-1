export default class NotificacionDTO {

    static fromDatabase(notificacion) {

        if (!notificacion) {
            return null;
        }

        return {
            idNotificacion: notificacion.idNotificacion,
            idUsuario: notificacion.idUsuario,
            titulo: notificacion.titulo,
            mensaje: notificacion.mensaje,
            tipo: notificacion.tipo,
            leida: notificacion.leida,
            fechaLectura: notificacion.fechaLectura,
            fechaCreacion: notificacion.fechaCreacion
        };

    }

}