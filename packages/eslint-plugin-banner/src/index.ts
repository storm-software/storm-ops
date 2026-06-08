import type { ESLint, Linter } from "eslint";
import { configs } from "./configs";
import { plugin } from "./plugin";

/**
 * ESLint plugin for Storm Software to enforce a consistent banner header across all source files in a project.
 *
 * @packageDocumentation
 * This plugin provides a rule to ensure that all source files contain a standardized banner header with metadata such as license information, organization name, and other relevant details. The banner header helps maintain consistency and provides important information about the file's ownership and licensing.
 *
 * The plugin includes a recommended configuration that can be extended in your ESLint configuration file to easily apply the banner rule across your project.
 *
 * @example
 * ```json
 * {
 *   "extends": ["plugin:storm-banner/recommended"]
 * }
 * ```
 *
 * This will apply the banner rule with the recommended settings, which can be customized further by providing options to the rule in your ESLint configuration.
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
