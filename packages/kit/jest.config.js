module.exports = {
  testEnvironment: "jsdom",
  moduleNameMapper: {
    "^@walletconnect": "<rootDir>/src/__mocks__/noop.ts",
    "^preact": "<rootDir>/src/__mocks__/noop.ts",
  },
  // This is a workaround with Jest v29 issues related to BigInt serialization
  // It can be removed once Jest v30 is released and upgraded
  // https://github.com/jestjs/jest/issues/11617
  workerThreads: true,
  setupFiles: ["<rootDir>/src/jest-setup.ts"],
}
