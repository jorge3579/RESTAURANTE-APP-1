import bcrypt from "bcrypt";

const SALT_ROUNDS = 10;

export async function generarHash(password) {

    return await bcrypt.hash(password, SALT_ROUNDS);

}

export async function verificarPassword(password, passwordHash) {

    return await bcrypt.compare(password, passwordHash);

}