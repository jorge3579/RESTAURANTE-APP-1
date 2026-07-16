import bcrypt from "bcrypt";

const password = process.argv[2];

if (!password) {
    console.log("Uso: node scripts/generate-password-hash.js TuPassword");
    process.exit(1);
}

const hash = await bcrypt.hash(password, 10);

console.log(hash);