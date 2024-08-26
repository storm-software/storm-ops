import type { Config } from "jest";

/**
 * Config for Jest unit tests
 *
 * https://jestjs.io/docs/configuration#projects-arraystring--projectconfig
 */

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
declare function getJestConfig(
  projectDir: string,
  isNode?: boolean,
  displayName?: string
): Config;
export { getJestConfig };
