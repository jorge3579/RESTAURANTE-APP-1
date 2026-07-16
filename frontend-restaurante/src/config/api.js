const API_CONFIG = {
    BASE_URL: process.env.EXPO_PUBLIC_API_URL || "http://10.0.2.2:3000/api",
    SOCKET_URL: process.env.EXPO_PUBLIC_SOCKET_URL || "http://10.0.2.2:3000",
    TIMEOUT: 15000
};

export default API_CONFIG;
