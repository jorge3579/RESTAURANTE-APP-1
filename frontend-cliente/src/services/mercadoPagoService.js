import httpClient from "./httpClient";

class MercadoPagoService {

    async crearPreferencia(idPedido) {

        const response = await httpClient.post(
            "/mercado-pago/preferencia",
            {
                idPedido
            }
        );

        return response.data.data;

    }

    async obtenerPorPedido(idPedido) {

        const response = await httpClient.get(
            `/mercado-pago/preferencia/pedido/${idPedido}`
        );

        return response.data.data;

    }

}

export default new MercadoPagoService();