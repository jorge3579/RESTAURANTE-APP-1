import httpClient from "./httpClient";

class PedidoService {

    async listar() {

        const response = await httpClient.get("/pedidos");

        return response.data.data;

    }

    async obtener(idPedido) {

        const response = await httpClient.get(`/pedidos/${idPedido}`);

        return response.data.data;

    }

    async cambiarEstado(idPedido, estado) {

        const response = await httpClient.put(
            `/pedidos/${idPedido}/estado`,
            {
                estado
            }
        );

        return response.data.data;

    }

}

export default new PedidoService();