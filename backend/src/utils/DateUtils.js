export default class DateUtils {

    static ahora() {

        return new Date();

    }

    static sumarMinutos(fecha, minutos) {

        const resultado = new Date(fecha);

        resultado.setMinutes(
            resultado.getMinutes() + minutos
        );

        return resultado;

    }

    static diferenciaMinutos(fechaInicio, fechaFin) {

        return Math.floor(
            (new Date(fechaFin).getTime() - new Date(fechaInicio).getTime()) / 60000
        );

    }

    static esFechaValida(valor) {

        const fecha = new Date(valor);

        return !Number.isNaN(fecha.getTime());

    }

    static soloFecha(fecha = new Date()) {

        return fecha.toISOString().split("T")[0];

    }

}