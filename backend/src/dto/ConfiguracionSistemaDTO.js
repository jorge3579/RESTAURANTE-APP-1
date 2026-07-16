export default class ConfiguracionSistemaDTO {

    static fromDatabase(configuracion){

        if(!configuracion){

            return null;

        }

        return{

            idConfiguracion:
                configuracion.idConfiguracion,

            clave:
                configuracion.clave,

            valor:
                configuracion.valor,

            descripcion:
                configuracion.descripcion,

            editable:
                configuracion.editable,

            fechaCreacion:
                configuracion.fechaCreacion,

            fechaModificacion:
                configuracion.fechaModificacion

        };

    }

}