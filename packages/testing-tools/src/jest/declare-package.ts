import type { Config } from "jest";
import { join } from "node:path";

export type DeclarePackageConfigOptions = Config & {
  projectRoot: string;
  isNode?: boolean;
  displayName?: string;
};

/**
 * Config for Jest unit tests
 *
 * @remarks Please see [the Jest documentation](https://jestjs.io/docs/configuration#projects-arraystring--projectconfig) for more information.
 *
 * @param options The options for the Jest configuration
 * @returns The Jest configuration
 */
export function declarePackage(options: DeclarePackageConfigOptions): Config {
  return {
    displayName: options.displayName
      ? options.displayName
      : options.projectRoot.replaceAll("\\", "-").replaceAll("/", "-"),
    preset: "@storm-software/testing-tools/jest/preset",
    testEnvironment: options.isNode ? "node" : "jsdom",
    transform: {
      "^.+\\.[tj]s$": ["ts-jest", { tsconfig: "<rootDir>/tsconfig.spec.json" }]
    },
    moduleFileExtensions: ["ts", "js", "html"],
    coverageDirectory: join("<rootDir>/coverage", options.projectRoot)
  };
}
