import { iniciarReservasJob } from "./reservasJob.js";
import { iniciarPromocionesJob } from "./promocionesJob.js";

export function iniciarJobs() {

    iniciarReservasJob();

    iniciarPromocionesJob();

}