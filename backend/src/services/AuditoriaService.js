import BaseService from "./BaseService.js";
import AuditoriaDTO from "../dto/AuditoriaDTO.js";

export default class AuditoriaService extends BaseService {

    async listar() {

        const registros = await this.repository.listar();

        return registros.map(AuditoriaDTO.fromDatabase);

    }

    async registrar(data) {

        await this.repository.crear({
            idUsuario: data.idUsuario || null,
            modulo: data.modulo,
            accion: data.accion,
            descripcion: data.descripcion || null,
            entidad: data.entidad || null,
            idEntidad: data.idEntidad || null,
            ip: data.ip || null,
            userAgent: data.userAgent || null,
            requestId: data.requestId || null
        });

        return true;

    }

}