export const COLORS = {
    primary: "#E53935",     // Rojo Fast Food (Energía y Apetito)
    secondary: "#1A1A1A",   // Negro Mate (Contraste y Modernidad)
    accent: "#FFB300",      // Amarillo Mostaza (Resaltados y Promos)
    background: "#FFFFFF",  // Fondo blanco limpio
    surface: "#F5F5F5",     // Gris muy claro para tarjetas
    text: "#212121",
    textLight: "#757575",
    error: "#C62828",
    success: "#2E7D32",
    border: "#EEEEEE",
    white: "#FFFFFF",
    black: "#000000"
};

export const SIZES = {
    base: 8,
    font: 14,
    radius: 12,
    padding: 24,

    h1: 30,
    h2: 22,
    h3: 16,
    h4: 14,
    body1: 30,
    body2: 22,
    body3: 16,
    body4: 14,
};

export const SHADOWS = {
    light: {
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.1,
        shadowRadius: 3,
        elevation: 3,
    },
    medium: {
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 4,
        },
        shadowOpacity: 0.15,
        shadowRadius: 5,
        elevation: 6,
    }
};

const theme = { COLORS, SIZES, SHADOWS };

export default theme;
