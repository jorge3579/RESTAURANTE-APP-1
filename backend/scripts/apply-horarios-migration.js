import { readFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import path from "node:path";

import pool, { closeDatabase } from "../src/config/database.js";

const currentDir = path.dirname(fileURLToPath(import.meta.url));
const migrationPath = path.join(currentDir, "..", "database", "035_horarios_cortados.sql");

try {
    const sql = await readFile(migrationPath, "utf8");
    const ownership = await pool.query(`
        SELECT CURRENT_USER AS current_user, tableowner
        FROM pg_tables
        WHERE schemaname = 'public' AND tablename = 'horarios_sucursal'
    `);
    console.log(`Usuario actual: ${ownership.rows[0]?.current_user}; propietario: ${ownership.rows[0]?.tableowner}.`);
    const columns = await pool.query(`
        SELECT column_name
        FROM information_schema.columns
        WHERE table_schema = 'public'
          AND table_name = 'horarios_sucursal'
          AND column_name IN ('hora_apertura_2', 'hora_cierre_2')
    `);
    if (columns.rowCount === 2) {
        console.log("Migración 035_horarios_cortados ya se encuentra aplicada.");
    } else {
        await pool.query(sql);
        console.log("Migración 035_horarios_cortados aplicada correctamente.");
    }
} finally {
    await closeDatabase();
}
