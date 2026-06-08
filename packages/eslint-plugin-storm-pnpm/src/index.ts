import { RuleDefinition, RuleDefinitionTypeOptions } from "@eslint/core";
import type { ESLint } from "eslint";
import { configs } from "./configs";
import { plugin } from "./plugin";

/**
 * ESLint plugin for Storm Software to enforce a consistent PNPM configuration across all source files in a project.
 *
 * @packageDocumentation
 * This plugin provides a rule to ensure that all source files contain standardized PNPM configuration with metadata such as license information, organization name, and other relevant details. The PNPM configuration helps maintain consistency and provide important information about the file's ownership and licensing.
 *
 * The plugin includes a recommended configuration that can be extended in your ESLint configuration file to easily apply the PNPM rules across your project.
 *
 * @example
 * ```json
 * {
 *   "extends": ["plugin:storm-pnpm/recommended"]
 * }
 * ```
 *
 * This will apply the PNPM rules with the recommended settings, which can be customized further by providing options to the rules in your ESLint configuration.
 *
 * @see [Storm Software](https://stormsoftware.com) for more information about our projects and licensing.
 */

const eslintPlugin: ESLint.Plugin = {
  ...plugin,
  configs
};

export default eslintPlugin;

export { configs };
export const rules = plugin.rules as Record<
  string,
  RuleDefinition<RuleDefinitionTypeOptions>
>;
