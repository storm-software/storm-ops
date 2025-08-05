import type { Config } from "jest";
import { join } from "node:path";

/**
 * Config for Jest unit tests
 *
 * @remarks Please see [the Jest documentation](https://jestjs.io/docs/configuration#projects-arraystring--projectconfig) for more information.
 *
 * @param projectDir The directory of the project
 * @param isNode Whether the project is a Node project
 * @param displayName The name to display in the Jest output
 * @returns The Jest configuration
 */
export function getJestConfig(
  projectDir: string,
  isNode = true,
  displayName?: string
): Config {
  return {
    displayName: displayName
      ? displayName
      : projectDir.replaceAll("\\", "-").replaceAll("/", "-"),
    preset: "@storm-software/testing-tools/jest/config/preset",
    testEnvironment: isNode ? "node" : "jsdom",
    transform: {
      "^.+\\.[tj]s$": ["ts-jest", { tsconfig: "<rootDir>/tsconfig.spec.json" }]
    },
    moduleFileExtensions: ["ts", "js", "html"],
    coverageDirectory: join("../../coverage", projectDir)
  };
}
