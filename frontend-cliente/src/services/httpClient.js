import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

import API_CONFIG from "../config/api";

const httpClient = axios.create({
    baseURL: API_CONFIG.BASE_URL,
    timeout: API_CONFIG.TIMEOUT,
    headers: {
        "Content-Type": "application/json",
        "ngrok-skip-browser-warning": "smartrestaurantqr"
    }
});

let refreshPromise = null;
let unauthorizedHandler = null;

export function setUnauthorizedHandler(handler) {
    unauthorizedHandler = handler;
}

async function limpiarSesion() {
    await AsyncStorage.multiRemove(["accessToken", "refreshToken", "usuario"]);
    unauthorizedHandler?.();
}

async function renovarAccessToken() {
    const refreshToken = await AsyncStorage.getItem("refreshToken");
    if (!refreshToken) throw new Error("La sesión no se puede renovar.");

    const response = await axios.post(
        `${API_CONFIG.BASE_URL}/auth/refresh`,
        { refreshToken },
        {
            timeout: API_CONFIG.TIMEOUT,
            headers: {
                "Content-Type": "application/json",
                "ngrok-skip-browser-warning": "smartrestaurantqr"
            }
        }
    );
    const { accessToken } = response.data.data;
    await AsyncStorage.setItem("accessToken", accessToken);
    return accessToken;
}

httpClient.interceptors.request.use(
    async (config) => {
        const token = await AsyncStorage.getItem("accessToken");

        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }

        return config;
    },
    (error) => Promise.reject(error)
);

httpClient.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;
        const esRutaPublica = ["/auth/login", "/auth/registrar", "/auth/refresh"]
            .some((ruta) => originalRequest?.url?.includes(ruta));

        if (error.response?.status !== 401 || originalRequest?._retry || esRutaPublica) {
            return Promise.reject(error);
        }

        originalRequest._retry = true;
        try {
            refreshPromise ??= renovarAccessToken().finally(() => {
                refreshPromise = null;
            });
            const accessToken = await refreshPromise;
            originalRequest.headers.Authorization = `Bearer ${accessToken}`;
            return httpClient(originalRequest);
        } catch (refreshError) {
            await limpiarSesion();
            return Promise.reject(refreshError);
        }
    }
);

export default httpClient;
