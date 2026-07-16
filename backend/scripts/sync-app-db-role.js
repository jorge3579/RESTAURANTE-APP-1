import pg from "pg";

import env from "../src/config/env.js";

const adminPassword = process.env.POSTGRES_ADMIN_PASSWORD;
if (!adminPassword) throw new Error("Falta POSTGRES_ADMIN_PASSWORD.");

const client = new pg.Client({
    host: env.database.host,
    port: env.database.port,
    database: env.database.name,
    user: "postgres",
    password: adminPassword
});

try {
    await client.connect();
    const role = env.database.user.replaceAll('"', '""');
    const password = env.database.password.replaceAll("'", "''");
    await client.query(`ALTER ROLE "${role}" PASSWORD '${password}'`);
    console.log("Credencial del rol de la API sincronizada.");
} finally {
    await client.end();
}
