module.exports = {
  preset: "react-native",
  passWithNoTests: true,
  moduleNameMapper: {
    "^@walletconnect": "<rootDir>/src/__mocks__/noop.ts",
  },
  transformIgnorePatterns: [
    "node_modules/(?!(react-native|@react-native|@onflow)/)",
  ],
  workerThreads: true,
}
