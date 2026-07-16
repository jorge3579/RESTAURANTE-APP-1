export default class BaseService {

    constructor(repository) {

        if (!repository) {
            throw new Error(
                "El repositorio es obligatorio para inicializar el servicio."
            );
        }

        this.repository = repository;

    }

}