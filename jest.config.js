module.exports = {
  "roots": [
    "<rootDir>/src"
  ],
  "transform": {
    "^.+\\.tsx?$": "ts-jest"
  },
  "testRegex": "(/__tests__/.*|(\\.|/)(test|spec))\\.tsx?$",
  "moduleFileExtensions": [
    "ts",
    "tsx",
    "js",
    "jsx",
    "json",
    "node"
  ],
  "watchPathIgnorePatterns": [
    "contracts/"
  ],
  // setting an actual url for jsdom rather than default of "about:config"
  // to avoid SecurityError
  "testURL": "https://localhost:3000",
  "setupFiles": ["./jestSetEnv.js"]
}