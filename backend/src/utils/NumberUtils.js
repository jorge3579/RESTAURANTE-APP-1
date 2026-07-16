export default class NumberUtils {

    static redondearMoneda(valor) {

        return Math.round((Number(valor) + Number.EPSILON) * 100) / 100;

    }

    static convertirNumero(valor, defecto = 0) {

        const numero = Number(valor);

        if (Number.isNaN(numero)) {
            return defecto;
        }

        return numero;

    }

}