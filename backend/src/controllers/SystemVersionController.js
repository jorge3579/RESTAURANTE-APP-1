import VERSION from "../constants/version.js";

import ApiResponse from "../helpers/ApiResponse.js";

export default class SystemVersionController {

    static obtener(req, res) {

        return ApiResponse.success(

            res,

            "Versión del sistema.",

            VERSION

        );

    }

}