import ApiResponse from "../helpers/ApiResponse.js";
import { dashboardService } from "../services/index.js";

export default class DashboardController {

    static async resumen(req, res, next) {

        try {

            const idSucursal = req.query.idSucursal
                ? Number(req.query.idSucursal)
                : null;

            const resumen = await dashboardService.resumen(idSucursal);

            return ApiResponse.success(
                res,
                "Resumen del dashboard obtenido correctamente.",
                resumen
            );

        } catch (error) {

            next(error);

        }

    }

}