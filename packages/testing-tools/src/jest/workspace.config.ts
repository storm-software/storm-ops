import { getJestProjectsAsync } from "@nx/jest";

/**
 * Config for Jest unit tests
 *
 * https://jestjs.io/docs/configuration#projects-arraystring--projectconfig
 */
export default {
  /**
   * When the projects configuration is provided with an array of paths or glob patterns, Jest will run tests in all of the specified projects at the same time.
   * This is great for monorepos or when working on multiple projects at the same time.
   */
  projects: await getJestProjectsAsync(),

  /**
   * Indicates whether the coverage information should be collected while executing the test. Because this retrofits all
   * executed files with coverage collection statements, it may significantly slow down your tests. Default: false
   */
  collectCoverage: process.env.CI ? true : false,

  /**
   * An array of glob patterns indicating a set of files for which coverage information should be collected.
   * If a file matches the specified glob pattern, coverage information will be collected for it even if no tests exist
   * for this file and it's never required in the test suite. Default: undefined
   */
  // collectCoverageFrom: ["**/*(!*.spec).tsx", "**/*(!*.spec).ts"],

  /**
   * The directory where Jest should output its coverage files. Default: undefined
   */
  coverageDirectory: "<rootDir>/coverage",

  /**
   * An array of regexp pattern strings that are matched against all file paths before executing the test. If the file path
   * matches any of the patterns, coverage information will be skipped.
   */
  coveragePathIgnorePatterns: [
    "\\.spec\\.ts$",
    "\\.test\\.ts$",
    "<rootDir>/dist",
    "<rootDir>/test",
    "<rootDir>/__generated__",
    "<rootDir>/node_modules"
  ],

  /**
   * The test environment that will be used for testing. The default environment in Jest is a Node.js environment.
   * If you are building a web app, you can use a browser-like environment through jsdom instead.
   */
  testEnvironment: "jest-environment-jsdom",

  /**
   * A list of reporter names that Jest uses when writing coverage reports. Any istanbul reporter can be used.
   * Default: ["json", "lcov", "text"]
   */
  coverageReporters: ["lcov", "json"],

  setupFiles: ["@storm-software/testing-tools/jest/__mocks__/jest.setup.js"],

  moduleNameMapper: {
    "\\.(jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$":
      "@storm-software/testing-tools/jest/__mocks__/file.mock.js",
    "\\.(css|less)$":
      "@storm-software/testing-tools/jest/__mocks__/style.mock.js"
  }
};
