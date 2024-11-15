const config = {
  preset: "jest-preset-preact",
  moduleNameMapper: {
    "\\.(jpg|ico|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$":
      "<rootDir>/src/mocks/file-mock.ts",
    "\\.(css|less)$": "<rootDir>/src/mocks/file-mock.ts",
  },
}

module.exports = config
