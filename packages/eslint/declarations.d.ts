import type { Linter } from "eslint";
import type { RuleOptions } from "./dist/preset.d";

/**
 * The module boundary dependency constraints.
 */
export type PresetModuleBoundaryDepConstraints = {
  sourceTag: string;
  onlyDependOnLibsWithTags: string[];
};

/**
 * The module boundary options.
 */
export type PresetModuleBoundary = {
  enforceBuildableLibDependency: boolean;
  allow: any[];
  depConstraints: PresetModuleBoundaryDepConstraints[];
};

/**
 * The ESLint preset options.
 */
export interface PresetOptions {
  rules?: RuleOptions;
  ignores?: string[];
  markdown?: false | Linter.RulesRecord;
  react?: false | Linter.RulesRecord;
}

/**
 * Get the ESLint configuration for a Storm workspace.
 *
 * @param options - The preset options.
 * @param userConfigs - Additional ESLint configurations.
 */
declare function getStormConfig(
  options: PresetOptions,
  ...userConfigs: Linter.FlatConfig[]
): Linter.FlatConfig[];
export { getStormConfig };
