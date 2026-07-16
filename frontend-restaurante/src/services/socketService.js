import { io } from "socket.io-client";

import API_CONFIG from "../config/api";

let socket = null;

class SocketService {

    conectar() {

        if (!socket) {

            socket = io(API_CONFIG.SOCKET_URL, {
                transports: ["websocket"],
                extraHeaders: {
                    "ngrok-skip-browser-warning": "smartrestaurantqr"
                }
            });

        }

        return socket;

    }

    unirseSucursal(idSucursal) {

        const socketActual = this.conectar();

        socketActual.emit(
            "joinSucursal",
            idSucursal
        );

    }

    escucharNuevoPedido(callback) {
        const socketActual = this.conectar();
        socketActual.on("nuevoPedido", callback);
        return () => socketActual.off("nuevoPedido", callback);
    }

    escucharNuevaReserva(callback) {
        const socketActual = this.conectar();
        socketActual.on("nuevaReserva", callback);
        return () => socketActual.off("nuevaReserva", callback);
    }

    escucharNuevaComanda(callback) {

        const socketActual = this.conectar();

        socketActual.on(
            "nuevaComanda",
            callback
        );
        return () => socketActual.off("nuevaComanda", callback);

    }

    escucharCambioEstadoComanda(callback) {

        const socketActual = this.conectar();

        socketActual.on(
            "estadoComandaActualizado",
            callback
        );
        return () => socketActual.off("estadoComandaActualizado", callback);

    }

    desconectar() {

        if (socket) {

            socket.disconnect();

            socket = null;

        }

    }

}

export default new SocketService();
