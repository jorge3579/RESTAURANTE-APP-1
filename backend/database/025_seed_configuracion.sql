/*
=========================================================
 SmartRestaurantQR
 PostgreSQL - Configuración inicial
=========================================================
*/

INSERT INTO configuracion_sistema
(
    clave,
    valor,
    tipo_dato,
    descripcion,
    categoria,
    editable,
    activo
)
VALUES
    (
        'RESERVA_ANTICIPACION_MINUTOS',
        '60',
        'ENTERO',
        'Anticipación mínima requerida para crear una reserva.',
        'RESERVAS',
        TRUE,
        TRUE
    ),
    (
        'CANCELACION_MINUTOS',
        '45',
        'ENTERO',
        'Minutos previos permitidos para devolución completa.',
        'RESERVAS',
        TRUE,
        TRUE
    ),
    (
        'TIEMPO_MAXIMO_MESA_MINUTOS',
        '90',
        'ENTERO',
        'Tiempo máximo de utilización de una mesa.',
        'MESAS',
        TRUE,
        TRUE
    ),
    (
        'TOLERANCIA_LLEGADA_MINUTOS',
        '30',
        'ENTERO',
        'Tolerancia para marcar una reserva como no asistida.',
        'RESERVAS',
        TRUE,
        TRUE
    ),
    (
        'CREDITOS_SIN_VENCIMIENTO',
        'true',
        'BOOLEANO',
        'Determina si los créditos por cancelación vencen.',
        'CREDITOS',
        TRUE,
        TRUE
    ),
    (
        'PROMOCIONES_ACUMULABLES',
        'false',
        'BOOLEANO',
        'Permite combinar promociones y descuentos.',
        'PROMOCIONES',
        TRUE,
        TRUE
    ),
    (
        'MONEDA',
        'ARS',
        'TEXTO',
        'Moneda utilizada por el sistema.',
        'GENERAL',
        FALSE,
        TRUE
    ),
    (
        'ZONA_HORARIA',
        'America/Argentina/Buenos_Aires',
        'TEXTO',
        'Zona horaria oficial del sistema.',
        'GENERAL',
        FALSE,
        TRUE
    ),
    (
        'VERSION_APLICACION',
        '2.0.0',
        'TEXTO',
        'Versión actual de SmartRestaurantQR.',
        'GENERAL',
        FALSE,
        TRUE
    )
ON CONFLICT (clave)
DO UPDATE
SET
    valor = EXCLUDED.valor,
    tipo_dato = EXCLUDED.tipo_dato,
    descripcion = EXCLUDED.descripcion,
    categoria = EXCLUDED.categoria,
    editable = EXCLUDED.editable,
    activo = TRUE,
    fecha_modificacion = CURRENT_TIMESTAMP;


INSERT INTO politicas_sistema
(
    codigo,
    nombre,
    contenido,
    version,
    obligatoria,
    fecha_vigencia,
    activa
)
VALUES
    (
        'CANCELACION_RESERVAS',
        'Política de cancelación de reservas',
        'Las reservas canceladas con al menos 45 minutos de anticipación reciben devolución completa. Las cancelaciones posteriores generan crédito para una futura reserva.',
        '1.0',
        TRUE,
        CURRENT_TIMESTAMP,
        TRUE
    ),
    (
        'NO_SHOW',
        'Política de inasistencia',
        'La inasistencia sin cancelación previa no genera devolución ni crédito.',
        '1.0',
        TRUE,
        CURRENT_TIMESTAMP,
        TRUE
    ),
    (
        'TERMINOS_USO',
        'Términos y condiciones de uso',
        'El usuario declara conocer y aceptar las reglas de reserva, pago, cancelación e ingreso mediante código QR.',
        '1.0',
        TRUE,
        CURRENT_TIMESTAMP,
        TRUE
    )
ON CONFLICT
(
    codigo,
    version
)
DO UPDATE
SET
    nombre = EXCLUDED.nombre,
    contenido = EXCLUDED.contenido,
    obligatoria = EXCLUDED.obligatoria,
    fecha_vigencia = EXCLUDED.fecha_vigencia,
    activa = TRUE,
    fecha_modificacion = CURRENT_TIMESTAMP;