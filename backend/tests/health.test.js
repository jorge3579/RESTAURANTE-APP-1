import request from "supertest";

import app from "../src/app.js";

describe("Health API", () => {

    test("GET /api/health", async () => {

        const response = await request(app)

            .get("/api/health");

        expect(response.statusCode).toBe(200);

        expect(response.body.success).toBe(true);

    });

});