import httpClient from "./httpClient";

class ComandaService {

    async listar() {

        const response = await httpClient.get("/comandas");

        return response.data.data;

    }

    async listarPorSucursal(idSucursal) {

        const response = await httpClient.get(
            `/comandas/sucursal/${idSucursal}`
        );

        return response.data.data;

    }

    async crear(data) {

        const response = await httpClient.post(
            "/comandas",
            data
        );

        return response.data.data;

    }

    async cambiarEstado(idComanda, estado, tiempoEstimadoMinutos = null) {

        const response = await httpClient.put(
            `/comandas/${idComanda}/estado`,
            {
                estado,
                tiempoEstimadoMinutos
            }
        );

        return response.data.data;

    }

}

export default new ComandaService();