import type { ESLint } from "eslint";
import { configs } from "./configs";
import { plugin } from "./plugin";

/**
 * ESLint plugin for Storm Software to enforce a consistent TSDoc documentation across all source files in a project.
 *
 * @packageDocumentation
 * This plugin provides a rule to ensure that all source files contain standardized TSDoc comments with metadata such as license information, organization name, and other relevant details. The TSDoc comments help maintain consistency and provide important information about the file's ownership and licensing.
 *
 * The plugin includes a recommended configuration that can be extended in your ESLint configuration file to easily apply the TSDoc rules across your project.
 *
 * @example
 * ```json
 * {
 *   "extends": ["plugin:storm-tsdoc/recommended"]
 * }
 * ```
 *
 * This will apply the TSDoc rules with the recommended settings, which can be customized further by providing options to the rules in your ESLint configuration.
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
