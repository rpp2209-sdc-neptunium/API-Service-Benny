module.exports = {
  testPathIgnorePatterns: [
    "/node_modules/",
    "/__tests__/k6scripts"
  ],

  "transform": {
    "^.+\\.[t|j]sx?$": "babel-jest"
  }
};