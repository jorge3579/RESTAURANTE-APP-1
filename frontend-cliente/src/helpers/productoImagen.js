import API_CONFIG from "../config/api";

export function resolverProductoImagen(imagenUrl) {
    if (!imagenUrl) return null;
    if (/^https?:\/\//i.test(imagenUrl)) return imagenUrl;
    const apiOrigin = API_CONFIG.BASE_URL.replace(/\/api\/?$/, "");
    return `${apiOrigin}${imagenUrl.startsWith("/") ? "" : "/"}${imagenUrl}`;
}
