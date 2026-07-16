import ApiResponse from "../helpers/ApiResponse.js";

import { pedidoService } from "../services/index.js";

export default class PedidoController {

    static async listar(req, res, next) {

        try {

            const pedidos =
                await pedidoService.listar();

            return ApiResponse.success(
                res,
                "Pedidos obtenidos correctamente.",
                pedidos
            );

        } catch (error) {

            next(error);

        }

    }

    static async obtenerPorId(req, res, next) {

        try {

            const { idPedido } = req.params;

            const pedido =
                await pedidoService.obtenerPorId(
                    Number(idPedido)
                );

            return ApiResponse.success(
                res,
                "Pedido obtenido correctamente.",
                pedido
            );

        } catch (error) {

            next(error);

        }

    }

    static async listarMios(req, res, next) {
        try {
            const pedidos = await pedidoService.listarPorUsuario(req.usuario.idUsuario);
            return ApiResponse.success(res, "Pedidos del usuario obtenidos correctamente.", pedidos);
        } catch (error) {
            next(error);
        }
    }

    static async crear(req, res, next) {

        try {

            const pedido =
                await pedidoService.crear(

                    req.usuario.idUsuario,

                    req.body

                );

            return ApiResponse.created(
                res,
                "Pedido creado correctamente.",
                pedido
            );

        } catch (error) {

            next(error);

        }

    }

    static async cambiarEstado(req, res, next) {

        try {

            const { idPedido } = req.params;

            const { estado } = req.body;

            const pedido =
                await pedidoService.cambiarEstado(

                    Number(idPedido),

                    estado

                );

            return ApiResponse.success(
                res,
                "Estado actualizado.",
                pedido
            );

        } catch (error) {

            next(error);

        }

    }

}
