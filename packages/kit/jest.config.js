module.exports = {
  testEnvironment: "jsdom",
  moduleNameMapper: {
    "walletconnect/relay-auth": "<rootDir>/src/__mocks__/relay-mock.ts",
  },
}
