const nxPreset = require("@nx/jest/preset").default;

module.exports = {
  ...nxPreset,
  collectCoverage: true,
  testTimeout: 30000,
  clearMocks: true,
  testMatch: ["**/+(*.)+(spec|test).+(ts|js)?(x)"],
  transform: {
    "^.+\\.(ts|js|html)$": "ts-jest",
  },
  snapshotFormat: {
    printBasicPrototype: false,
  },
  globals: {
    "ts-jest": {
      isolatedModules: true,
      diagnostics: {
        exclude: ["**"],
      },
    },
  },
  moduleFileExtensions: ["ts", "js", "html"],
  coverageReporters: ["json", "lcov", "text", "clover", "text-summary", "html"],
  maxWorkers: 1,
};
