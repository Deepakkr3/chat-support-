/***
 * @jest-environment node
 * @author: {Deepak Kumar} <deepak.kumar@suhora.com>
 */


export default {
    preset: "ts-jest",
    testEnvironment: "node",
    collectCoverage: false,
    coverageReporters: ["text", "lcov"],
    coverageDirectory: "coverage",
    testMatch: ["**/*.test.ts"], // Match all .test.ts files
    moduleFileExtensions: ["ts", "js", "json", "node"],
  }
  