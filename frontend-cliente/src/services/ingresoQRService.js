import httpClient from "./httpClient";

class IngresoQRService {

    async generar(idReserva) {

        const response = await httpClient.post(
            `/ingresos-qr/reserva/${idReserva}/generar`
        );

        return response.data.data;

    }

    async validar(codigoQR, dispositivo = "App Cliente") {

        const response = await httpClient.post(
            "/ingresos-qr/validar",
            {
                codigoQR,
                dispositivo
            }
        );

        return response.data.data;

    }

}

export default new IngresoQRService();