module.exports = {
  testEnvironment: "jsdom",
  moduleNameMapper: {
    "^@walletconnect": "<rootDir>/src/__mocks__/noop.ts",
    "^preact": "<rootDir>/src/__mocks__/noop.ts",
  },
}
