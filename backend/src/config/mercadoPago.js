import { MercadoPagoConfig, Preference, Payment } from "mercadopago";

import env from "./env.js";

const mercadoPagoClient = new MercadoPagoConfig({
    accessToken: env.mercadoPago.accessToken || "",
    options: {
        timeout: 5000
    }
});

export const mercadoPagoPreference = new Preference(
    mercadoPagoClient
);

export const mercadoPagoPayment = new Payment(
    mercadoPagoClient
);