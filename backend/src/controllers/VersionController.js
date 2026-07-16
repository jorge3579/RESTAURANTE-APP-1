import ApiResponse from "../helpers/ApiResponse.js";

import version from "../version.js";

export default class VersionController {

    static obtener(req, res) {

        return ApiResponse.success(

            res,

            "Información de versión.",

            version

        );

    }

}