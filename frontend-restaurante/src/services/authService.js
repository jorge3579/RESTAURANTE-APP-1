import AsyncStorage from "@react-native-async-storage/async-storage";

import httpClient from "./httpClient";

export async function login(email, password) {
    const response = await httpClient.post("/auth/login", { email, password });
    const { accessToken, refreshToken, usuario } = response.data.data;

    await AsyncStorage.multiSet([
        ["accessToken", accessToken],
        ["refreshToken", refreshToken],
        ["usuario", JSON.stringify(usuario)]
    ]);

    return usuario;
}

export async function logout() {
    const refreshToken = await AsyncStorage.getItem("refreshToken");
    if (refreshToken) {
        try {
            await httpClient.post("/auth/logout", { refreshToken });
        } catch {
            // La sesión local debe cerrarse aunque la API no esté disponible.
        }
    }
    await AsyncStorage.multiRemove(["accessToken", "refreshToken", "usuario"]);
}

export async function obtenerUsuarioGuardado() {
    const usuario = await AsyncStorage.getItem("usuario");
    if (!usuario) return null;

    try {
        const response = await httpClient.get("/auth/me");
        const usuarioActual = response.data.data.usuario;
        await AsyncStorage.setItem("usuario", JSON.stringify(usuarioActual));
        return usuarioActual;
    } catch {
        await AsyncStorage.multiRemove(["accessToken", "refreshToken", "usuario"]);
        return null;
    }
}
