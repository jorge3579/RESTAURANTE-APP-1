/*
=========================================================
 SmartRestaurantQR
 PostgreSQL - Datos iniciales de sucursal, mesas y menú
=========================================================
*/

INSERT INTO sucursales
(
    nombre,
    descripcion,
    direccion,
    ciudad,
    provincia,
    codigo_postal,
    telefono,
    email,
    activo
)
VALUES
(
    'Sucursal Centro',
    'Sucursal principal de SmartRestaurantQR.',
    'Av. Principal 123',
    'Bahía Blanca',
    'Buenos Aires',
    '8000',
    '2910000000',
    'centro@smartrestaurantqr.com',
    TRUE
)
ON CONFLICT (nombre)
DO UPDATE
SET
    descripcion = EXCLUDED.descripcion,
    direccion = EXCLUDED.direccion,
    ciudad = EXCLUDED.ciudad,
    provincia = EXCLUDED.provincia,
    codigo_postal = EXCLUDED.codigo_postal,
    telefono = EXCLUDED.telefono,
    email = EXCLUDED.email,
    activo = TRUE,
    fecha_modificacion = CURRENT_TIMESTAMP;


/*
Horarios:
1 lunes
2 martes
3 miércoles
4 jueves
5 viernes
6 sábado
7 domingo
*/

INSERT INTO horarios_sucursal
(
    id_sucursal,
    dia_semana,
    hora_apertura,
    hora_cierre,
    cerrado
)
SELECT
    s.id_sucursal,
    datos.dia_semana,
    datos.hora_apertura,
    datos.hora_cierre,
    FALSE
FROM sucursales s
CROSS JOIN
(
    VALUES
        (1, TIME '11:00', TIME '23:30'),
        (2, TIME '11:00', TIME '23:30'),
        (3, TIME '11:00', TIME '23:30'),
        (4, TIME '11:00', TIME '23:30'),
        (5, TIME '11:00', TIME '00:30'),
        (6, TIME '11:00', TIME '00:30'),
        (7, TIME '11:00', TIME '23:30')
) AS datos
(
    dia_semana,
    hora_apertura,
    hora_cierre
)
WHERE s.nombre = 'Sucursal Centro'
ON CONFLICT (id_sucursal, dia_semana)
DO UPDATE
SET
    hora_apertura = EXCLUDED.hora_apertura,
    hora_cierre = EXCLUDED.hora_cierre,
    cerrado = EXCLUDED.cerrado,
    activo = TRUE,
    fecha_modificacion = CURRENT_TIMESTAMP;


/*
Mesas iniciales.
*/

INSERT INTO mesas
(
    id_sucursal,
    numero,
    nombre,
    capacidad,
    capacidad_maxima,
    ubicacion,
    estado,
    permite_union,
    activa
)
SELECT
    s.id_sucursal,
    datos.numero,
    datos.nombre,
    datos.capacidad,
    datos.capacidad_maxima,
    datos.ubicacion,
    'LIBRE',
    TRUE,
    TRUE
FROM sucursales s
CROSS JOIN
(
    VALUES
        ('1', 'Mesa 1', 2, 2, 'Salón principal'),
        ('2', 'Mesa 2', 4, 4, 'Salón principal'),
        ('3', 'Mesa 3', 4, 6, 'Salón principal'),
        ('4', 'Mesa 4', 6, 8, 'Salón principal'),
        ('5', 'Mesa 5', 2, 2, 'Ventana'),
        ('6', 'Mesa 6', 4, 6, 'Terraza')
) AS datos
(
    numero,
    nombre,
    capacidad,
    capacidad_maxima,
    ubicacion
)
WHERE s.nombre = 'Sucursal Centro'
ON CONFLICT (id_sucursal, numero)
DO UPDATE
SET
    nombre = EXCLUDED.nombre,
    capacidad = EXCLUDED.capacidad,
    capacidad_maxima = EXCLUDED.capacidad_maxima,
    ubicacion = EXCLUDED.ubicacion,
    activa = TRUE,
    fecha_modificacion = CURRENT_TIMESTAMP;


/*
Categorías.
*/

INSERT INTO categorias
(
    nombre,
    descripcion,
    orden_visual,
    activa
)
VALUES
    (
        'Entradas',
        'Platos para comenzar.',
        1,
        TRUE
    ),
    (
        'Platos principales',
        'Platos principales del menú.',
        2,
        TRUE
    ),
    (
        'Hamburguesas',
        'Hamburguesas artesanales.',
        3,
        TRUE
    ),
    (
        'Bebidas',
        'Bebidas sin alcohol.',
        4,
        TRUE
    ),
    (
        'Postres',
        'Postres y opciones dulces.',
        5,
        TRUE
    )
ON CONFLICT (nombre)
DO UPDATE
SET
    descripcion = EXCLUDED.descripcion,
    orden_visual = EXCLUDED.orden_visual,
    activa = TRUE,
    fecha_modificacion = CURRENT_TIMESTAMP;


/*
Productos.
*/

INSERT INTO productos
(
    id_categoria,
    codigo,
    nombre,
    descripcion,
    precio,
    costo,
    tiempo_preparacion_minutos,
    disponible,
    permite_take_away,
    permite_consumo_local,
    controla_stock,
    destacado,
    activo
)
SELECT
    c.id_categoria,
    datos.codigo,
    datos.nombre,
    datos.descripcion,
    datos.precio,
    datos.costo,
    datos.tiempo_preparacion,
    TRUE,
    TRUE,
    TRUE,
    datos.controla_stock,
    datos.destacado,
    TRUE
FROM categorias c
INNER JOIN
(
    VALUES
        (
            'PAPAS-001',
            'Papas fritas',
            'Porción de papas fritas.',
            3500.00::NUMERIC,
            1200.00::NUMERIC,
            15,
            TRUE,
            FALSE,
            'Entradas'
        ),
        (
            'MILANESA-001',
            'Milanesa con papas',
            'Milanesa completa con guarnición.',
            7800.00::NUMERIC,
            3200.00::NUMERIC,
            25,
            TRUE,
            TRUE,
            'Platos principales'
        ),
        (
            'HAMB-001',
            'Hamburguesa completa',
            'Hamburguesa con queso, lechuga y tomate.',
            6900.00::NUMERIC,
            2800.00::NUMERIC,
            20,
            TRUE,
            TRUE,
            'Hamburguesas'
        ),
        (
            'GASEOSA-500',
            'Gaseosa 500 ml',
            'Bebida gaseosa de 500 ml.',
            1800.00::NUMERIC,
            800.00::NUMERIC,
            1,
            TRUE,
            FALSE,
            'Bebidas'
        ),
        (
            'AGUA-500',
            'Agua mineral 500 ml',
            'Agua mineral sin gas.',
            1200.00::NUMERIC,
            500.00::NUMERIC,
            1,
            TRUE,
            FALSE,
            'Bebidas'
        ),
        (
            'FLAN-001',
            'Flan casero',
            'Flan casero con dulce de leche.',
            3200.00::NUMERIC,
            1000.00::NUMERIC,
            5,
            TRUE,
            FALSE,
            'Postres'
        )
) AS datos
(
    codigo,
    nombre,
    descripcion,
    precio,
    costo,
    tiempo_preparacion,
    controla_stock,
    destacado,
    categoria
)
    ON c.nombre = datos.categoria
ON CONFLICT (codigo)
DO UPDATE
SET
    id_categoria = EXCLUDED.id_categoria,
    nombre = EXCLUDED.nombre,
    descripcion = EXCLUDED.descripcion,
    precio = EXCLUDED.precio,
    costo = EXCLUDED.costo,
    tiempo_preparacion_minutos =
        EXCLUDED.tiempo_preparacion_minutos,
    disponible = TRUE,
    permite_take_away =
        EXCLUDED.permite_take_away,
    permite_consumo_local =
        EXCLUDED.permite_consumo_local,
    controla_stock =
        EXCLUDED.controla_stock,
    destacado = EXCLUDED.destacado,
    activo = TRUE,
    fecha_modificacion = CURRENT_TIMESTAMP;


/*
Habilitar todos los productos en la sucursal principal.
*/

INSERT INTO productos_sucursal
(
    id_producto,
    id_sucursal,
    precio,
    disponible
)
SELECT
    p.id_producto,
    s.id_sucursal,
    p.precio,
    TRUE
FROM productos p
CROSS JOIN sucursales s
WHERE s.nombre = 'Sucursal Centro'
ON CONFLICT (id_producto, id_sucursal)
DO UPDATE
SET
    precio = EXCLUDED.precio,
    disponible = TRUE,
    fecha_modificacion = CURRENT_TIMESTAMP;