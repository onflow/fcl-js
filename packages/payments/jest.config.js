module.exports = {
  testEnvironment: "node",
  transform: {
    "^.+\\.ts$": [
      "ts-jest",
      {
        tsconfig: {
          esModuleInterop: true,
        },
      },
    ],
    "^.+\\.cdc$": "<rootDir>/jest-cdc-transform.js",
  },
  moduleNameMapper: {
    "^.+\\.json$": "<rootDir>/jest-json-transform.js",
  },
}
