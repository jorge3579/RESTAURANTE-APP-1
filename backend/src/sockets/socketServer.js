import { Server } from "socket.io";

let io = null;

export function initSocket(server) {

    io = new Server(server, {
        cors: {
            origin: "*",
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