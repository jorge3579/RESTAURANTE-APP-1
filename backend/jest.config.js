export default {

    testEnvironment: "node",

    collectCoverage: true,

    collectCoverageFrom: [

        "src/**/*.js",

        "!src/server.js"

    ],

    coverageDirectory: "./coverage",

    verbose: true

};