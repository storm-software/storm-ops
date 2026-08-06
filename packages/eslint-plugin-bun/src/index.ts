import type { ESLint, Linter } from "eslint";
import { configs } from "./configs";
import { plugin } from "./plugin";

/**
 * ESLint plugin for Storm Software to enforce Bun catalog usage across monorepo packages.
 *
 * Catalog versions are stored in the workspace root `package.json` (`catalog` /
 * `catalogs`, top-level or under `workspaces`), matching Bun's catalog protocol:
 * https://bun.com/docs/pm/catalogs
 *
 * @packageDocumentation
 *
 * @example
 * ```js
 * import bun from "@storm-software/eslint-plugin-bun";
 *
 * export default [
 *   ...bun.configs.recommended,
 * ];
 * ```
 *
 * @see [Storm Software](https://stormsoftware.com) for more information about our projects and licensing.
 */

const eslintPlugin: ESLint.Plugin = {
  ...plugin,
  configs
};

export default eslintPlugin;

export { configs };
export const rules = plugin.rules;

type RuleDefinitions = (typeof plugin)["rules"];

export type RuleOptions = {
  [K in keyof RuleDefinitions]: RuleDefinitions[K]["defaultOptions"];
};

export type Rules = {
  [K in keyof RuleOptions]: Linter.RuleEntry<RuleOptions[K]>;
};
