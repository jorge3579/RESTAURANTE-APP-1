import ApiResponse from "../helpers/ApiResponse.js";

import AppInfo from "../utils/AppInfo.js";

export default class SystemController {

    static async info(req, res) {

        return ApiResponse.success(

            res,

            "Información del sistema.",

            AppInfo.obtener()

        );

    }

}