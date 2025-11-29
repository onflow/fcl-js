module.exports = {
  testEnvironment: "node",
  testMatch: ["**/__tests__/**/*.test.ts", "**/__tests__/**/*.test.tsx"],
  moduleFileExtensions: ["ts", "tsx", "js", "jsx", "json"],
  transform: {
    "^.+\\.(ts|tsx)$": [
      "babel-jest",
      {
        presets: [
          "@babel/preset-env",
          "@babel/preset-typescript",
          "@babel/preset-react",
        ],
      },
    ],
  },
  transformIgnorePatterns: [
    "node_modules/(?!(@onflow|@tanstack|react-native)/)",
  ],
  moduleNameMapper: {
    "^react-native$": "<rootDir>/node_modules/react-native",
  },
  collectCoverageFrom: [
    "src/**/*.{ts,tsx}",
    "!src/**/*.test.{ts,tsx}",
    "!src/__tests__/**",
  ],
}
