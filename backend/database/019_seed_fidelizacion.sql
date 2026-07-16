/*
=========================================================
 SmartRestaurantQR
 PostgreSQL - Configuración inicial de fidelización
=========================================================
*/

INSERT INTO configuracion_fidelizacion
(
    nombre,
    valor,
    descripcion
)
VALUES
    (
        'COMPRAS_PARA_PREMIO',
        5,
        'Cantidad de compras necesarias para generar un premio.'
    ),
    (
        'PUNTOS_CADA_MONTO',
        100,
        'Monto en pesos necesario para generar un punto.'
    ),
    (
        'VENCIMIENTO_PREMIO_DIAS',
        90,
        'Cantidad de días de vigencia de un premio.'
    ),
    (
        'EVALUACION_VIP_DIAS',
        90,
        'Frecuencia en días para evaluar el nivel VIP.'
    ),
    (
        'DESCUENTO_GENERAL_PORCENTAJE',
        10,
        'Descuento general configurable por monto.'
    )
ON CONFLICT (nombre)
DO UPDATE
SET
    valor = EXCLUDED.valor,
    descripcion = EXCLUDED.descripcion,
    activo = TRUE,
    fecha_modificacion = CURRENT_TIMESTAMP;


INSERT INTO niveles_vip
(
    nombre,
    orden_nivel,
    compras_minimas,
    monto_minimo,
    descuento_porcentaje,
    descripcion,
    activo
)
VALUES
    (
        'Bronce',
        1,
        0,
        0,
        0,
        'Nivel inicial del programa VIP.',
        TRUE
    ),
    (
        'Plata',
        2,
        5,
        50000,
        5,
        'Nivel para clientes frecuentes.',
        TRUE
    ),
    (
        'Oro',
        3,
        10,
        120000,
        10,
        'Nivel avanzado para clientes frecuentes.',
        TRUE
    ),
    (
        'Platino',
        4,
        20,
        250000,
        15,
        'Nivel máximo del programa VIP.',
        TRUE
    )
ON CONFLICT (nombre)
DO UPDATE
SET
    orden_nivel = EXCLUDED.orden_nivel,
    compras_minimas = EXCLUDED.compras_minimas,
    monto_minimo = EXCLUDED.monto_minimo,
    descuento_porcentaje =
        EXCLUDED.descuento_porcentaje,
    descripcion = EXCLUDED.descripcion,
    activo = TRUE,
    fecha_modificacion = CURRENT_TIMESTAMP;