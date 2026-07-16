import crypto from "crypto";

export default class StringUtils {

    static generarCodigo(longitud = 8) {

        const caracteres =
            "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";

        let codigo = "";

        for (let i = 0; i < longitud; i++) {

            codigo += caracteres.charAt(
                Math.floor(Math.random() * caracteres.length)
            );

        }

        return codigo;

    }

    static generarUUID() {

        return crypto.randomUUID();

    }

    static capitalizar(texto = "") {

        return texto
            .toLowerCase()
            .replace(/\b\w/g, (c) => c.toUpperCase());

    }

    static limpiarEspacios(texto = "") {

        return texto.trim().replace(/\s+/g, " ");

    }

}