import { getIO } from "../sockets/socketServer.js";

export function emitirNuevaComanda(idSucursal, comanda) {

    const io = getIO();

    io.to(`sucursal-${idSucursal}`).emit(
        "nuevaComanda",
        comanda
    );

}

export function emitirCambioEstadoComanda(idSucursal, comanda) {

    const io = getIO();

    io.to(`sucursal-${idSucursal}`).emit(
        "estadoComandaActualizado",
        comanda
    );

}