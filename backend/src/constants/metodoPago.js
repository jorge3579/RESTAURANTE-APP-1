export const METODOS_PAGO = Object.freeze({
    MERCADO_PAGO: "MERCADO_PAGO",
    PAYWAY: "PAYWAY",
    EFECTIVO: "EFECTIVO",
    CREDITO_INTERNO: "CREDITO_INTERNO"
});

export const METODOS_PAGO_VALIDOS = Object.freeze(
    Object.values(METODOS_PAGO)
);

export default METODOS_PAGO;