export function obtenerMensajeApi(error, mensajePredeterminado) {

    if (!error?.response) {

        if (error?.code === "ECONNABORTED") {
            return "El servidor no respondio a tiempo. Verifique la conexion e intente nuevamente.";
        }

        return "No se pudo conectar con el servidor. Verifique Wi-Fi, Hamachi y el puente de red.";

    }

    const errores = error.response.data?.errors;

    if (Array.isArray(errores) && errores.length > 0) {
        return errores
            .map((item) => item.message)
            .filter(Boolean)
            .join("\n");
    }

    return error.response.data?.message || mensajePredeterminado;

}
