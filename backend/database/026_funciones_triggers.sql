/*
=========================================================
 SmartRestaurantQR
 PostgreSQL - Funciones y triggers automáticos
=========================================================
*/


/*
---------------------------------------------------------
 1. Actualizar fecha_modificacion automáticamente
---------------------------------------------------------
*/

CREATE OR REPLACE FUNCTION fn_actualizar_fecha_modificacion()
RETURNS TRIGGER
LANGUAGE plpgsql
AS
$$
BEGIN

    NEW.fecha_modificacion = CURRENT_TIMESTAMP;

    RETURN NEW;

END;
$$;


/*
Aplicar el trigger solamente a tablas que poseen
la columna fecha_modificacion.
*/

DO
$$
DECLARE

    nombre_tabla TEXT;

    tablas TEXT[] :=
    ARRAY
    [
        'roles',
        'permisos',
        'usuarios',
        'usuario_roles',
        'sucursales',
        'horarios_sucursal',
        'mesas',
        'grupos_mesas',
        'categorias',
        'productos',
        'productos_sucursal',
        'ingredientes',
        'producto_ingredientes',
        'reservas',
        'pedidos',
        'pedido_detalles',
        'pagos',
        'devoluciones_pago',
        'mercado_pago_preferencias',
        'promociones',
        'creditos_usuario',
        'configuracion_fidelizacion',
        'niveles_vip',
        'puntos_usuario',
        'dispositivos_push',
        'notificaciones',
        'comandas',
        'comanda_detalles',
        'impresiones_comanda',
        'cajas',
        'configuracion_sistema',
        'politicas_sistema'
    ];

BEGIN

    FOREACH nombre_tabla IN ARRAY tablas
    LOOP

        IF EXISTS
        (
            SELECT 1
            FROM information_schema.tables
            WHERE table_schema = 'public'
              AND table_name = nombre_tabla
        )
        THEN

            EXECUTE FORMAT
            (
                'DROP TRIGGER IF EXISTS trg_%I_fecha_modificacion ON %I',
                nombre_tabla,
                nombre_tabla
            );

            EXECUTE FORMAT
            (
                'CREATE TRIGGER trg_%I_fecha_modificacion
                 BEFORE UPDATE ON %I
                 FOR EACH ROW
                 EXECUTE FUNCTION fn_actualizar_fecha_modificacion()',
                nombre_tabla,
                nombre_tabla
            );

        END IF;

    END LOOP;

END
$$;


/*
---------------------------------------------------------
 2. Generar número de pedido
---------------------------------------------------------
*/

CREATE OR REPLACE FUNCTION fn_generar_numero_pedido()
RETURNS TRIGGER
LANGUAGE plpgsql
AS
$$
BEGIN

    IF NEW.numero_pedido IS NULL
       OR TRIM(NEW.numero_pedido) = ''
    THEN

        NEW.numero_pedido :=
            'PED-'
            || TO_CHAR(
                CURRENT_TIMESTAMP,
                'YYYYMMDD'
            )
            || '-'
            || LPAD(
                NEXTVAL(
                    PG_GET_SERIAL_SEQUENCE(
                        'pedidos',
                        'id_pedido'
                    )
                )::TEXT,
                8,
                '0'
            );

    END IF;

    RETURN NEW;

END;
$$;


DROP TRIGGER IF EXISTS
    trg_pedidos_generar_numero
ON pedidos;


CREATE TRIGGER trg_pedidos_generar_numero
BEFORE INSERT
ON pedidos
FOR EACH ROW
EXECUTE FUNCTION fn_generar_numero_pedido();


/*
---------------------------------------------------------
 3. Generar número de comanda
---------------------------------------------------------
*/

CREATE OR REPLACE FUNCTION fn_generar_numero_comanda()
RETURNS TRIGGER
LANGUAGE plpgsql
AS
$$
BEGIN

    IF NEW.numero_comanda IS NULL
       OR TRIM(NEW.numero_comanda) = ''
    THEN

        NEW.numero_comanda :=
            'COM-'
            || TO_CHAR(
                CURRENT_TIMESTAMP,
                'YYYYMMDD'
            )
            || '-'
            || LPAD(
                NEXTVAL(
                    PG_GET_SERIAL_SEQUENCE(
                        'comandas',
                        'id_comanda'
                    )
                )::TEXT,
                8,
                '0'
            );

    END IF;

    RETURN NEW;

END;
$$;


DROP TRIGGER IF EXISTS
    trg_comandas_generar_numero
ON comandas;


CREATE TRIGGER trg_comandas_generar_numero
BEFORE INSERT
ON comandas
FOR EACH ROW
EXECUTE FUNCTION fn_generar_numero_comanda();


/*
---------------------------------------------------------
 4. Recalcular totales del pedido
---------------------------------------------------------
*/

CREATE OR REPLACE FUNCTION fn_recalcular_totales_pedido()
RETURNS TRIGGER
LANGUAGE plpgsql
AS
$$
DECLARE

    pedido_afectado BIGINT;

    subtotal_calculado NUMERIC(14, 2);

BEGIN

    pedido_afectado :=
        COALESCE(
            NEW.id_pedido,
            OLD.id_pedido
        );

    SELECT
        COALESCE(
            SUM(subtotal),
            0
        )
    INTO subtotal_calculado
    FROM pedido_detalles
    WHERE id_pedido = pedido_afectado;

    UPDATE pedidos
    SET
        subtotal = subtotal_calculado,
        total =
            GREATEST(
                subtotal_calculado
                - descuento
                + recargo,
                0
            )
    WHERE id_pedido = pedido_afectado;

    RETURN COALESCE(NEW, OLD);

END;
$$;


DROP TRIGGER IF EXISTS
    trg_pedido_detalles_recalcular_total
ON pedido_detalles;


CREATE TRIGGER trg_pedido_detalles_recalcular_total
AFTER INSERT OR UPDATE OR DELETE
ON pedido_detalles
FOR EACH ROW
EXECUTE FUNCTION fn_recalcular_totales_pedido();


/*
---------------------------------------------------------
 5. Calcular subtotal de cada detalle
---------------------------------------------------------
*/

CREATE OR REPLACE FUNCTION fn_calcular_subtotal_detalle()
RETURNS TRIGGER
LANGUAGE plpgsql
AS
$$
BEGIN

    NEW.subtotal :=
        GREATEST
        (
            NEW.cantidad
            * NEW.precio_unitario
            - NEW.descuento,
            0
        );

    RETURN NEW;

END;
$$;


DROP TRIGGER IF EXISTS
    trg_pedido_detalles_calcular_subtotal
ON pedido_detalles;


CREATE TRIGGER trg_pedido_detalles_calcular_subtotal
BEFORE INSERT OR UPDATE
ON pedido_detalles
FOR EACH ROW
EXECUTE FUNCTION fn_calcular_subtotal_detalle();


/*
---------------------------------------------------------
 6. Registrar historial de reservas
---------------------------------------------------------
*/

CREATE OR REPLACE FUNCTION fn_historial_estado_reserva()
RETURNS TRIGGER
LANGUAGE plpgsql
AS
$$
BEGIN

    IF OLD.estado IS DISTINCT FROM NEW.estado
    THEN

        INSERT INTO historial_reservas
        (
            id_reserva,
            estado_anterior,
            estado_nuevo,
            observaciones
        )
        VALUES
        (
            NEW.id_reserva,
            OLD.estado,
            NEW.estado,
            'Cambio automático registrado por PostgreSQL.'
        );

    END IF;

    RETURN NEW;

END;
$$;


DROP TRIGGER IF EXISTS
    trg_reservas_historial_estado
ON reservas;


CREATE TRIGGER trg_reservas_historial_estado
AFTER UPDATE OF estado
ON reservas
FOR EACH ROW
EXECUTE FUNCTION fn_historial_estado_reserva();


/*
---------------------------------------------------------
 7. Registrar historial de pedidos
---------------------------------------------------------
*/

CREATE OR REPLACE FUNCTION fn_historial_estado_pedido()
RETURNS TRIGGER
LANGUAGE plpgsql
AS
$$
BEGIN

    IF OLD.estado IS DISTINCT FROM NEW.estado
    THEN

        INSERT INTO historial_pedidos
        (
            id_pedido,
            estado_anterior,
            estado_nuevo,
            observaciones
        )
        VALUES
        (
            NEW.id_pedido,
            OLD.estado,
            NEW.estado,
            'Cambio automático registrado por PostgreSQL.'
        );

    END IF;

    RETURN NEW;

END;
$$;


DROP TRIGGER IF EXISTS
    trg_pedidos_historial_estado
ON pedidos;


CREATE TRIGGER trg_pedidos_historial_estado
AFTER UPDATE OF estado
ON pedidos
FOR EACH ROW
EXECUTE FUNCTION fn_historial_estado_pedido();


/*
---------------------------------------------------------
 8. Registrar historial de comandas
---------------------------------------------------------
*/

CREATE OR REPLACE FUNCTION fn_historial_estado_comanda()
RETURNS TRIGGER
LANGUAGE plpgsql
AS
$$
BEGIN

    IF OLD.estado IS DISTINCT FROM NEW.estado
    THEN

        INSERT INTO historial_comandas
        (
            id_comanda,
            estado_anterior,
            estado_nuevo,
            observaciones
        )
        VALUES
        (
            NEW.id_comanda,
            OLD.estado,
            NEW.estado,
            'Cambio automático registrado por PostgreSQL.'
        );

    END IF;

    RETURN NEW;

END;
$$;


DROP TRIGGER IF EXISTS
    trg_comandas_historial_estado
ON comandas;


CREATE TRIGGER trg_comandas_historial_estado
AFTER UPDATE OF estado
ON comandas
FOR EACH ROW
EXECUTE FUNCTION fn_historial_estado_comanda();


/*
---------------------------------------------------------
 9. Actualizar fechas según estado del pedido
---------------------------------------------------------
*/

CREATE OR REPLACE FUNCTION fn_actualizar_fechas_pedido()
RETURNS TRIGGER
LANGUAGE plpgsql
AS
$$
BEGIN

    IF OLD.estado IS DISTINCT FROM NEW.estado
    THEN

        CASE NEW.estado

            WHEN 'CONFIRMADO'
            THEN
                NEW.fecha_confirmacion :=
                    COALESCE(
                        NEW.fecha_confirmacion,
                        CURRENT_TIMESTAMP
                    );

            WHEN 'EN_PREPARACION'
            THEN
                NEW.fecha_inicio_preparacion :=
                    COALESCE(
                        NEW.fecha_inicio_preparacion,
                        CURRENT_TIMESTAMP
                    );

            WHEN 'LISTO'
            THEN
                NEW.fecha_listo :=
                    COALESCE(
                        NEW.fecha_listo,
                        CURRENT_TIMESTAMP
                    );

            WHEN 'ENTREGADO'
            THEN
                NEW.fecha_entrega :=
                    COALESCE(
                        NEW.fecha_entrega,
                        CURRENT_TIMESTAMP
                    );

            WHEN 'CANCELADO'
            THEN
                NEW.fecha_cancelacion :=
                    COALESCE(
                        NEW.fecha_cancelacion,
                        CURRENT_TIMESTAMP
                    );

            ELSE
                NULL;

        END CASE;

    END IF;

    RETURN NEW;

END;
$$;


DROP TRIGGER IF EXISTS
    trg_pedidos_actualizar_fechas
ON pedidos;


CREATE TRIGGER trg_pedidos_actualizar_fechas
BEFORE UPDATE OF estado
ON pedidos
FOR EACH ROW
EXECUTE FUNCTION fn_actualizar_fechas_pedido();


/*
---------------------------------------------------------
 10. Actualizar fechas según estado de comanda
---------------------------------------------------------
*/

CREATE OR REPLACE FUNCTION fn_actualizar_fechas_comanda()
RETURNS TRIGGER
LANGUAGE plpgsql
AS
$$
BEGIN

    IF OLD.estado IS DISTINCT FROM NEW.estado
    THEN

        CASE NEW.estado

            WHEN 'EN_PREPARACION'
            THEN
                NEW.fecha_inicio :=
                    COALESCE(
                        NEW.fecha_inicio,
                        CURRENT_TIMESTAMP
                    );

            WHEN 'LISTA'
            THEN
                NEW.fecha_lista :=
                    COALESCE(
                        NEW.fecha_lista,
                        CURRENT_TIMESTAMP
                    );

            WHEN 'ENTREGADA'
            THEN
                NEW.fecha_entrega :=
                    COALESCE(
                        NEW.fecha_entrega,
                        CURRENT_TIMESTAMP
                    );

            WHEN 'CANCELADA'
            THEN
                NEW.fecha_cancelacion :=
                    COALESCE(
                        NEW.fecha_cancelacion,
                        CURRENT_TIMESTAMP
                    );

            ELSE
                NULL;

        END CASE;

    END IF;

    RETURN NEW;

END;
$$;


DROP TRIGGER IF EXISTS
    trg_comandas_actualizar_fechas
ON comandas;


CREATE TRIGGER trg_comandas_actualizar_fechas
BEFORE UPDATE OF estado
ON comandas
FOR EACH ROW
EXECUTE FUNCTION fn_actualizar_fechas_comanda();


/*
---------------------------------------------------------
 11. Liberar mesas al finalizar o cancelar una reserva
---------------------------------------------------------
*/

CREATE OR REPLACE FUNCTION fn_actualizar_mesas_reserva()
RETURNS TRIGGER
LANGUAGE plpgsql
AS
$$
BEGIN

    IF OLD.estado IS DISTINCT FROM NEW.estado
    THEN

        IF NEW.estado = 'EN_CURSO'
        THEN

            UPDATE mesas
            SET estado = 'OCUPADA'
            WHERE id_mesa IN
            (
                SELECT id_mesa
                FROM reserva_mesas
                WHERE id_reserva = NEW.id_reserva
                  AND liberada = FALSE
            );

        ELSIF NEW.estado = 'CONFIRMADA'
        THEN

            UPDATE mesas
            SET estado = 'RESERVADA'
            WHERE id_mesa IN
            (
                SELECT id_mesa
                FROM reserva_mesas
                WHERE id_reserva = NEW.id_reserva
                  AND liberada = FALSE
            );

        ELSIF NEW.estado IN
        (
            'FINALIZADA',
            'CANCELADA',
            'NO_ASISTIO',
            'VENCIDA'
        )
        THEN

            UPDATE reserva_mesas
            SET
                liberada = TRUE,
                fecha_liberacion =
                    CURRENT_TIMESTAMP
            WHERE id_reserva = NEW.id_reserva
              AND liberada = FALSE;

            UPDATE mesas
            SET estado = 'LIBRE'
            WHERE id_mesa IN
            (
                SELECT id_mesa
                FROM reserva_mesas
                WHERE id_reserva = NEW.id_reserva
            );

        END IF;

    END IF;

    RETURN NEW;

END;
$$;


DROP TRIGGER IF EXISTS
    trg_reservas_actualizar_mesas
ON reservas;


CREATE TRIGGER trg_reservas_actualizar_mesas
AFTER UPDATE OF estado
ON reservas
FOR EACH ROW
EXECUTE FUNCTION fn_actualizar_mesas_reserva();

/*
---------------------------------------------------------
 12. Corregir números utilizando el ID ya asignado
---------------------------------------------------------
*/

CREATE OR REPLACE FUNCTION fn_completar_numero_pedido()
RETURNS TRIGGER
LANGUAGE plpgsql
AS
$$
BEGIN

    IF NEW.numero_pedido IS NULL
       OR TRIM(NEW.numero_pedido) = ''
    THEN

        UPDATE pedidos
        SET numero_pedido =
            'PED-'
            || TO_CHAR(
                NEW.fecha_creacion,
                'YYYYMMDD'
            )
            || '-'
            || LPAD(
                NEW.id_pedido::TEXT,
                8,
                '0'
            )
        WHERE id_pedido = NEW.id_pedido;

    END IF;

    RETURN NEW;

END;
$$;


DROP TRIGGER IF EXISTS
    trg_pedidos_generar_numero
ON pedidos;


DROP TRIGGER IF EXISTS
    trg_pedidos_completar_numero
ON pedidos;


CREATE TRIGGER trg_pedidos_completar_numero
AFTER INSERT
ON pedidos
FOR EACH ROW
EXECUTE FUNCTION fn_completar_numero_pedido();


CREATE OR REPLACE FUNCTION fn_completar_numero_comanda()
RETURNS TRIGGER
LANGUAGE plpgsql
AS
$$
BEGIN

    IF NEW.numero_comanda IS NULL
       OR TRIM(NEW.numero_comanda) = ''
    THEN

        UPDATE comandas
        SET numero_comanda =
            'COM-'
            || TO_CHAR(
                NEW.fecha_creacion,
                'YYYYMMDD'
            )
            || '-'
            || LPAD(
                NEW.id_comanda::TEXT,
                8,
                '0'
            )
        WHERE id_comanda = NEW.id_comanda;

    END IF;

    RETURN NEW;

END;
$$;


DROP TRIGGER IF EXISTS
    trg_comandas_generar_numero
ON comandas;


DROP TRIGGER IF EXISTS
    trg_comandas_completar_numero
ON comandas;


CREATE TRIGGER trg_comandas_completar_numero
AFTER INSERT
ON comandas
FOR EACH ROW
EXECUTE FUNCTION fn_completar_numero_comanda();