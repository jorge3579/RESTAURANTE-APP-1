export default class AuditoriaDTO {

    static fromDatabase(auditoria) {

        if (!auditoria) {
            return null;
        }

        return {
            idAuditoria: auditoria.idAuditoria,
            idUsuario: auditoria.idUsuario,
            usuario: auditoria.usuario || null,
            modulo: auditoria.modulo,
            accion: auditoria.accion,
            descripcion: auditoria.descripcion,
            entidad: auditoria.entidad,
            idEntidad: auditoria.idEntidad,
            ip: auditoria.ip,
            userAgent: auditoria.userAgent,
            requestId: auditoria.requestId,
            fechaCreacion: auditoria.fechaCreacion
        };

    }

}