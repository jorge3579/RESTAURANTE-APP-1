import httpClient from "./httpClient";

class FidelizacionService {

    async misPuntos() {

        const response = await httpClient.get("/fidelizacion/mis-puntos");

        return response.data.data;

    }

    async historial() {

        const response = await httpClient.get("/fidelizacion/historial");

        return response.data.data;

    }

    async canjearPremio() {

        const response = await httpClient.post("/fidelizacion/canjear-premio");

        return response.data.data;

    }

}

export default new FidelizacionService();