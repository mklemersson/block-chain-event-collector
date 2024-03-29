/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
  preset: "ts-jest",
  testEnvironment: "node",
  bail: true,
  modulePaths: ["<rootDir>/src/*", "<rootDir>/tests/*"],
  setupFilesAfterEnv: ["<rootDir>/tests/config/setup.js"],
};
