import { Server } from "socket.io";

import env from "../config/env.js";

let io = null;

// Igual que en HTTP, los clientes nativos no envían Origin: se permite la
// conexión sin cabecera y se restringen solo los orígenes de navegador.
function crearValidadorOrigen(origenesPermitidos) {

    if (origenesPermitidos.includes("*")) {

        return "*";

    }

    return (origin, callback) => {

        if (!origin) {

            return callback(null, true);

        }

        return callback(
            null,
            origenesPermitidos.includes(origin)
        );

    };

}

export function initSocket(server) {

    io = new Server(server, {
        cors: {
            origin: crearValidadorOrigen(env.cors.origins),
            methods: ["GET", "POST", "PUT", "DELETE"]
        }
    });

    io.on("connection", (socket) => {

        console.log(`Socket conectado: ${socket.id}`);

        socket.on("joinSucursal", (idSucursal) => {
            socket.join(`sucursal-${idSucursal}`);
        });

        socket.on("disconnect", () => {
            console.log(`Socket desconectado: ${socket.id}`);
        });

    });

    return io;

}

export function getIO() {

    if (!io) {
        throw new Error("Socket.IO no fue inicializado.");
    }

    return io;

}