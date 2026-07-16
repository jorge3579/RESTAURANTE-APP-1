import crypto from "node:crypto";
import path from "node:path";
import { fileURLToPath } from "node:url";
import multer from "multer";

const currentDirectory = path.dirname(fileURLToPath(import.meta.url));
export const productoImagenDirectory = path.resolve(currentDirectory, "../../imagen producto");

const extensions = new Map([
    ["image/jpeg", ".jpg"],
    ["image/png", ".png"],
    ["image/webp", ".webp"]
]);

const storage = multer.diskStorage({
    destination: (_req, _file, callback) => callback(null, productoImagenDirectory),
    filename: (_req, file, callback) => {
        const extension = extensions.get(file.mimetype);
        callback(null, `${crypto.randomUUID()}${extension}`);
    }
});

const upload = multer({
    storage,
    limits: { fileSize: 5 * 1024 * 1024, files: 1 },
    fileFilter: (_req, file, callback) => {
        if (!extensions.has(file.mimetype)) {
            const error = new Error("La imagen debe ser JPG, PNG o WEBP.");
            error.statusCode = 400;
            callback(error);
            return;
        }
        callback(null, true);
    }
});

export default function productoImagenMiddleware(req, res, next) {
    upload.single("imagen")(req, res, (error) => {
        if (error) error.statusCode = error.statusCode || 400;
        next(error);
    });
}
