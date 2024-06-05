/**
 * The markdownlint library used by Storm Software for building TypeScript applications.
 *
 * @remarks
 * An opinionated collection of markdownlint rules used by Storm Software.
 *
 * @packageDocumentation
 */

import _ from "lodash";
import { rules } from "./rules";
import accessibilityRules from "./style/accessibility.json";
import base from "./style/base.json";

const offByDefault = [] as string[];

for (const rule of rules) {
  const ruleName = (rule as any)?.names[1];
  if (ruleName) {
    base[ruleName] = offByDefault.includes(ruleName) ? false : true;
  }
}

export const init = function init(defaultConfig) {
  return _.defaultsDeep(defaultConfig, accessibilityRules, base);
};

export default [...rules];
