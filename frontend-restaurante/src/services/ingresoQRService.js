import httpClient from "./httpClient";

class IngresoQRService {

    async validar(codigoQR, dispositivo = "App Restaurante") {

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