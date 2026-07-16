import BaseService from "./BaseService.js";
import PermisoDTO from "../dto/PermisoDTO.js";

export default class PermisoService extends BaseService {

    async listar() {

        const permisos = await this.repository.listar();

        return permisos.map(PermisoDTO.fromDatabase);

    }

    async listarPorRol(idRol) {

        const permisos = await this.repository.listarPorRol(idRol);

        return permisos.map(PermisoDTO.fromDatabase);

    }

    async usuarioTienePermiso(idUsuario, codigoPermiso) {

        return await this.repository.usuarioTienePermiso(
            idUsuario,
            codigoPermiso
        );

    }

    async asignarPermisosARol(idRol, permisos) {

        await this.repository.eliminarPermisosDeRol(idRol);

        for (const idPermiso of permisos) {

            await this.repository.asignarPermisoARol(
                idRol,
                idPermiso
            );

        }

        return await this.listarPorRol(idRol);

    }

}