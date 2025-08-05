import nxPreset from "@nx/jest/preset";
import defu from "defu";
import type { Config } from "jest";

export function declarePreset(config: Partial<Config> = {}): Config {
  return defu(
    config,
    {
      collectCoverage: true,
      testTimeout: 30000,
      clearMocks: true,
      testMatch: ["**/+(*.)+(spec|test).+(ts|js)?(x)"],
      transform: {
        "^.+\\.(ts|js|mts|mjs|cts|cjs|html)$": [
          "ts-jest",
          { tsconfig: "<rootDir>/tsconfig.spec.json" }
        ]
      },
      snapshotFormat: {
        printBasicPrototype: false
      },
      globals: {
        "ts-jest": {
          isolatedModules: true,
          diagnostics: {
            exclude: ["**"]
          }
        }
      },
      moduleFileExtensions: ["ts", "js", "html"],
      coverageReporters: [
        "json",
        "lcov",
        "text",
        "clover",
        "text-summary",
        "html"
      ],
      maxWorkers: 1
    },
    nxPreset ?? {}
  ) as Config;
}
