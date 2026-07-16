import ApiResponse from "../helpers/ApiResponse.js";

import {
    auditoriaService
} from "../services/index.js";

export default class AuditoriaController {

    static async listar(req, res, next) {

        try {

            const registros =
                await auditoriaService.listar();

            return ApiResponse.success(
                res,
                "Auditoría obtenida correctamente.",
                registros
            );

        } catch (error) {

            next(error);

        }

    }

}