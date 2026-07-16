import fs from "fs";
import path from "path";

export default class FileUtils {

    static existe(ruta) {

        return fs.existsSync(ruta);

    }

    static crearDirectorio(ruta) {

        if (!this.existe(ruta)) {

            fs.mkdirSync(ruta, {
                recursive: true
            });

        }

    }

    static eliminarArchivo(ruta) {

        if (this.existe(ruta)) {

            fs.unlinkSync(ruta);

        }

    }

    static nombreArchivo(ruta) {

        return path.basename(ruta);

    }

    static extension(ruta) {

        return path.extname(ruta);

    }

}