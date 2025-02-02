/**
 * The markdownlint library used by Storm Software for building TypeScript applications.
 *
 * @remarks
 * An opinionated collection of markdownlint rules used by Storm Software.
 *
 * @packageDocumentation
 */

import defu from "defu";
import { markdownlintConfig } from "./markdownlint";
import { rules as customRules } from "./rules";

const offByDefault = [] as string[];

const baseConfig = { ...markdownlintConfig };

for (const rule of customRules) {
  const ruleName = (rule as any)?.names[1];
  if (ruleName) {
    baseConfig[ruleName] = offByDefault.includes(ruleName) ? false : true;
  }
}

export const init = function init(defaultConfig) {
  return defu(defaultConfig, baseConfig);
};

export const rules = [...customRules];

export const config = baseConfig;
export default config;
