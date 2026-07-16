import bcrypt from "bcrypt";

const password = "Admin1234";

try {

    const hash = await bcrypt.hash(password, 12);

    console.log("Contraseña:", password);
    console.log("Hash:", hash);

} catch (error) {

    console.error("Error generando el hash:", error);

    process.exit(1);
}