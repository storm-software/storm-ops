/**
 * The markdownlint library used by Storm Software for building TypeScript applications.
 *
 * @remarks
 * An opinionated collection of markdownlint rules used by Storm Software.
 *
 * @packageDocumentation
 */

import _ from "lodash";
import accessibilityRules from "./style/accessibility.json";
import base from "./style/base.json";
import { rules } from "./rules";

const offByDefault = ["no-empty-alt-text"];

for (const rule of rules) {
  const ruleName = rule.names[1];
  base[ruleName] = offByDefault.includes(ruleName) ? false : true;
}

export const init = function init(defaultConfig) {
  return _.defaultsDeep(defaultConfig, accessibilityRules, base);
};

export default [...rules];
