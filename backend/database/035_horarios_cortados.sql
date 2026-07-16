ALTER TABLE horarios_sucursal
    ADD COLUMN IF NOT EXISTS hora_apertura_2 TIME,
    ADD COLUMN IF NOT EXISTS hora_cierre_2 TIME;

