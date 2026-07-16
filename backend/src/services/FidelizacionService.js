import BaseService from "./BaseService.js";
import NivelVIPDTO from "../dto/NivelVIPDTO.js";
import PuntosUsuarioDTO from "../dto/PuntosUsuarioDTO.js";
import HistorialPuntosDTO from "../dto/HistorialPuntosDTO.js";
import TIPO_MOVIMIENTO_PUNTOS from "../constants/tipoMovimientoPuntos.js";

export default class FidelizacionService extends BaseService {

    async listarNivelesVIP() {

        const niveles = await this.repository.listarNivelesVIP();

        return niveles.map(NivelVIPDTO.fromDatabase);

    }

    async obtenerOCrearPuntosUsuario(idUsuario) {

        let puntosUsuario = await this.repository.obtenerPuntosUsuario(idUsuario);

        if (!puntosUsuario) {

            const nivelInicial = await this.repository.obtenerNivelPorCompras(0);

            await this.repository.crearPuntosUsuario(
                idUsuario,
                nivelInicial ? nivelInicial.idNivelVIP : null
            );

            puntosUsuario = await this.repository.obtenerPuntosUsuario(idUsuario);

        }

        return puntosUsuario;

    }

    async obtenerPuntosUsuario(idUsuario) {

        const puntosUsuario = await this.obtenerOCrearPuntosUsuario(idUsuario);

        return PuntosUsuarioDTO.fromDatabase(puntosUsuario);

    }

    async sumarCompra(idUsuario, idPedido, totalPedido) {

        const puntosActuales = await this.obtenerOCrearPuntosUsuario(idUsuario);

        const puntosGanados = Math.floor(Number(totalPedido) / 100);

        const nuevasCompras = puntosActuales.comprasAcumuladas + 1;

        const nuevosPuntos = puntosActuales.puntos + puntosGanados;

        const nuevoNivel = await this.repository.obtenerNivelPorCompras(nuevasCompras);

        await this.repository.actualizarPuntosUsuario(idUsuario, {
            puntos: nuevosPuntos,
            comprasAcumuladas: nuevasCompras,
            idNivelVIP: nuevoNivel ? nuevoNivel.idNivelVIP : puntosActuales.idNivelVIP
        });

        await this.repository.registrarMovimiento({
            idUsuario,
            idPedido: idPedido || null,
            puntos: puntosGanados,
            tipoMovimiento: TIPO_MOVIMIENTO_PUNTOS.SUMA,
            descripcion: "Puntos generados por compra."
        });

        return await this.obtenerPuntosUsuario(idUsuario);

    }

    async canjearPremio(idUsuario) {

        const puntosActuales = await this.obtenerOCrearPuntosUsuario(idUsuario);

        if (puntosActuales.comprasAcumuladas < 5) {
            throw new Error("El usuario aún no alcanzó las 5 compras necesarias para el premio.");
        }

        const comprasRestantes = puntosActuales.comprasAcumuladas - 5;

        const nuevoNivel = await this.repository.obtenerNivelPorCompras(comprasRestantes);

        await this.repository.actualizarPuntosUsuario(idUsuario, {
            puntos: puntosActuales.puntos,
            comprasAcumuladas: comprasRestantes,
            idNivelVIP: nuevoNivel ? nuevoNivel.idNivelVIP : puntosActuales.idNivelVIP
        });

        await this.repository.registrarMovimiento({
            idUsuario,
            idPedido: null,
            puntos: 0,
            tipoMovimiento: TIPO_MOVIMIENTO_PUNTOS.PREMIO,
            descripcion: "Premio canjeado: comida + bebida gratis."
        });

        return await this.obtenerPuntosUsuario(idUsuario);

    }

    async listarHistorial(idUsuario) {

        const historial = await this.repository.listarHistorial(idUsuario);

        return historial.map(HistorialPuntosDTO.fromDatabase);

    }

}