import { createProxyMiddleware } from "http-proxy-middleware";

const STOCK_PROXY_PATH = "/stock";
const STOCK_PROXY_TARGET = process.env.STOCK_PROXY_TARGET || "http://127.0.0.1:5050";
const stockProxyTargetWithPath = `${STOCK_PROXY_TARGET.replace(/\/+$/, "")}${STOCK_PROXY_PATH}`;

const stockProxy = createProxyMiddleware({
    pathFilter: (pathname) =>
        pathname === STOCK_PROXY_PATH || pathname.startsWith(`${STOCK_PROXY_PATH}/`),
    target: stockProxyTargetWithPath,
    pathRewrite: { [`^${STOCK_PROXY_PATH}`]: "" },
    ws: true,
    xfwd: true,
    changeOrigin: false,
    proxyTimeout: 30000,
    timeout: 30000,
    on: {
        error(error, _req, res) {
            console.error(`No se pudo conectar con Stock: ${error.message}`);

            if (res && !res.headersSent && typeof res.writeHead === "function") {
                res.writeHead(502, { "Content-Type": "application/json; charset=utf-8" });
                res.end(
                    JSON.stringify({
                        success: false,
                        message: "La aplicacion de stock no esta disponible."
                    })
                );
            }
        }
    }
});

export { STOCK_PROXY_PATH, STOCK_PROXY_TARGET, stockProxy };
