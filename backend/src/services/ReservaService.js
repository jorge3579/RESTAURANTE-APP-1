import BaseService from "./BaseService.js";
import AppError from "../utils/AppError.js";
import ReservaDTO from "../dto/ReservaDTO.js";
import ESTADO_RESERVA from "../constants/estadoReserva.js";
import { getIO } from "../sockets/socketServer.js";

export default class ReservaService extends BaseService {

    constructor(repository, ingresoQRService, sucursalRepository) {
        super(repository);
        this.ingresoQRService = ingresoQRService;
        this.sucursalRepository = sucursalRepository;
    }

    async listar() {

        const reservas = await this.repository.listar();

        return reservas.map(ReservaDTO.fromDatabase);

    }

    async listarPorUsuario(idUsuario) {

        const reservas = await this.repository.listarPorUsuario(idUsuario);

        return reservas.map(ReservaDTO.fromDatabase);

    }

    async obtenerPorId(idReserva) {

        const reserva = await this.repository.obtenerPorId(idReserva);

        if (!reserva) {
            throw new AppError("Reserva no encontrada.", 404);
        }

        return ReservaDTO.fromDatabase(reserva);

    }

    validarAnticipacion(fechaReserva, horaReserva) {

        const fechaHoraReserva = new Date(`${fechaReserva}T${horaReserva}`);

        const ahora = new Date();

        const diferenciaMinutos = (fechaHoraReserva.getTime() - ahora.getTime()) / 60000;

        if (diferenciaMinutos < 60) {
            throw new AppError(
                "La reserva debe realizarse con al menos 60 minutos de anticipación.",
                400
            );
        }

    }

    async crear(idUsuario, data) {

        this.validarAnticipacion(data.fechaReserva, data.horaReserva);

        const horarios = await this.sucursalRepository.listarHorarios(data.idSucursal);
        if (horarios.length > 0) {
            const fecha = new Date(`${data.fechaReserva}T12:00:00`);
            const diaSemana = fecha.getDay() === 0 ? 7 : fecha.getDay();
            const horario = horarios.find((item) => Number(item.diaSemana) === diaSemana);

            const aMinutos = (valor) => {
                if (!valor) return null;
                const [hora, minuto] = String(valor).slice(0, 5).split(":").map(Number);
                return hora * 60 + minuto;
            };
            const horaReserva = aMinutos(data.horaReserva);
            const dentroDe = (apertura, cierre) => {
                const desde = aMinutos(apertura);
                const hasta = aMinutos(cierre);
                if (desde === null || hasta === null) return false;
                return hasta < desde
                    ? horaReserva >= desde || horaReserva <= hasta
                    : horaReserva >= desde && horaReserva <= hasta;
            };

            if (!horario || horario.cerrado || !(
                dentroDe(horario.horaApertura, horario.horaCierre) ||
                dentroDe(horario.horaApertura2, horario.horaCierre2)
            )) {
                throw new AppError("La sucursal está cerrada en el horario seleccionado.", 409);
            }
        }

        const mesa = await this.repository.buscarMesaDisponible(
            data.idSucursal,
            data.fechaReserva,
            data.horaReserva,
            data.cantidadPersonas
        );

        if (!mesa) {
            throw new AppError(
                "No hay mesas disponibles para ese horario. Debe seleccionar otro horario.",
                409
            );
        }

        const resultado = await this.repository.crear({
            idUsuario,
            idSucursal: data.idSucursal,
            idMesa: mesa.idMesa,
            fechaReserva: data.fechaReserva,
            horaReserva: data.horaReserva,
            cantidadPersonas: data.cantidadPersonas,
            estado: ESTADO_RESERVA.PENDIENTE_PAGO,
            observaciones: data.observaciones || null,
            codigoQR: null
        });

        const reservaCreada = await this.obtenerPorId(resultado.idReserva);

        return reservaCreada;

    }

    async confirmar(idReserva) {

        const reserva = await this.obtenerPorId(idReserva);

        if (reserva.estado === ESTADO_RESERVA.CONFIRMADA) {
            return reserva;
        }

        if (![
            ESTADO_RESERVA.PENDIENTE,
            ESTADO_RESERVA.PENDIENTE_PAGO
        ].includes(reserva.estado)) {
            throw new AppError("La reserva no puede confirmarse en su estado actual.", 409);
        }

        await this.repository.actualizarEstado(
            idReserva,
            ESTADO_RESERVA.CONFIRMADA
        );

        const reservaConfirmada = await this.obtenerPorId(idReserva);

        try {
            const io = getIO();
            io.to(`sucursal-${reservaConfirmada.idSucursal}`).emit(
                "nuevaReserva",
                reservaConfirmada
            );
        } catch (error) {
            console.error("Error al emitir socket nuevaReserva:", error.message);
        }

        return reservaConfirmada;

    }

    async cancelar(idReserva) {

        const reserva = await this.obtenerPorId(idReserva);

        const fechaHoraReserva = new Date(
            `${reserva.fechaReserva}T${reserva.horaReserva}`
        );

        const ahora = new Date();

        const diferenciaMinutos = (fechaHoraReserva.getTime() - ahora.getTime()) / 60000;

        if (diferenciaMinutos < 45) {
            throw new AppError(
                "La reserva está dentro de los 45 minutos previos. Debe gestionarse como crédito interno.",
                400
            );
        }

        await this.repository.cancelar(idReserva);

        return await this.obtenerPorId(idReserva);

    }

    async finalizar(idReserva) {

        await this.obtenerPorId(idReserva);

        await this.repository.actualizarEstado(
            idReserva,
            ESTADO_RESERVA.FINALIZADA
        );

        return await this.obtenerPorId(idReserva);

    }

    async marcarNoAsistio(idReserva) {

        await this.obtenerPorId(idReserva);

        await this.repository.actualizarEstado(
            idReserva,
            ESTADO_RESERVA.NO_ASISTIO
        );

        return await this.obtenerPorId(idReserva);

    }

}
