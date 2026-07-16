import httpClient from "./httpClient";

class NotificacionService {

    async listar() {

        const response = await httpClient.get("/notificaciones");

        return response.data.data;

    }

    async marcarLeida(idNotificacion) {

        const response = await httpClient.put(
            `/notificaciones/${idNotificacion}/leida`
        );

        return response.data.data;

    }

    async eliminar(idNotificacion) {

        const response = await httpClient.delete(
            `/notificaciones/${idNotificacion}`
        );

        return response.data.data;

    }

}

export default new NotificacionService();