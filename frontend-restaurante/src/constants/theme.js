export const COLORS = {
    primary: "#FFC107",     // Amarillo Brillante (Acción/Visibilidad)
    secondary: "#000000",   // Negro (Máximo Contraste)
    accent: "#FF5722",      // Naranja fuerte para alertas
    background: "#121212",  // Fondo oscuro para no cansar la vista en cocina
    surface: "#1E1E1E",     // Tarjetas oscuras
    text: "#FFFFFF",        // Texto blanco para contraste
    textLight: "#B0B0B0",
    error: "#FF5252",
    success: "#4CAF50",
    border: "#333333",
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
