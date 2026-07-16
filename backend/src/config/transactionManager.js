import defaultDatabaseManager from "./databaseManager.js";

export default class TransactionManager {

    constructor(databaseManager = defaultDatabaseManager) {

        if (!databaseManager) {
            throw new Error(
                "TransactionManager requiere databaseManager."
            );
        }

        this.databaseManager = databaseManager;

    }

    async run(callback) {

        if (typeof callback !== "function") {
            throw new TypeError(
                "La transacción requiere una función callback."
            );
        }

        return await this.databaseManager.transaction(callback);

    }

}
