import {
  isArrayPrototypeProperty,
  isObjectPrototypeProperty
} from "./array-or-object-prototype-property";
import avoidCapture from "./avoid-capture";
import { getBooleanAncestor, isBooleanNode } from "./boolean";
import escapeString from "./escape-string";
import getAncestor from "./get-ancestor";
import getCallExpressionArgumentsText from "./get-call-expression-arguments-text";
import getCallExpressionTokens from "./get-call-expression-tokens";
import getReferences from "./get-references";
import getScopes from "./get-scopes";
import getVariableIdentifiers from "./get-variable-identifiers";
import hasOptionalChainElement from "./has-optional-chain-element";
import isFunctionSelfUsedInside from "./is-function-self-used-inside";
import isLeftHandSide from "./is-left-hand-side";
import isLogicalExpression from "./is-logical-expression";
import isMethodNamed from "./is-method-named";
import { isNodeMatches, isNodeMatchesNameOrPath } from "./is-node-matches";
import isNodeValueNotDomNode from "./is-node-value-not-dom-node";
import isNodeValueNotFunction from "./is-node-value-not-function";
import isOnSameLine from "./is-on-same-line";
import isSameIdentifier from "./is-same-identifier";
import isSameReference from "./is-same-reference";
import isShadowed from "./is-shadowed";
import isValueNotUsable from "./is-value-not-usable";
import needsSemicolon from "./needs-semicolon";
import {
  getParentheses,
  getParenthesizedRange,
  getParenthesizedText,
  getParenthesizedTimes,
  isParenthesized
} from "./parentheses";
import { reportProblems } from "./rule";
import shouldAddParenthesesToAwaitExpressionArgument from "./should-add-parentheses-to-await-expression-argument";
import shouldAddParenthesesToCallExpressionCallee from "./should-add-parentheses-to-call-expression-callee";
import shouldAddParenthesesToMemberExpressionObject from "./should-add-parentheses-to-member-expression-object";
import singular from "./singular";
import toLocation from "./to-location";

export * from "./array-or-object-prototype-property";
export * from "./assert-token";
export * from "./avoid-capture";
export * from "./boolean";
export * from "./builtins";
export * from "./cartesian-product-samples";
export * from "./create-deprecated-rules";
export * from "./escape-string";
export * from "./escape-template-element-raw";
export * from "./get-ancestor";
export * from "./get-builtin-rule";
export * from "./get-call-expression-arguments-text";
export * from "./get-call-expression-tokens";
export * from "./get-class-head-location";
export * from "./get-documentation-url";
export * from "./get-indent-string";
export * from "./get-previous-node";
export * from "./get-references";
export * from "./get-scopes";
export * from "./get-switch-case-head-location";
export * from "./get-variable-identifiers";
export * from "./global-reference-tracker";
export * from "./has-optional-chain-element";
export * from "./has-same-range";
export * from "./is-function-self-used-inside";
export * from "./is-left-hand-side";
export * from "./is-logical-expression";
export * from "./is-method-named";
export * from "./is-new-expression-with-parentheses";
export * from "./is-node-matches";
export * from "./is-node-value-not-dom-node";
export * from "./is-node-value-not-function";
export * from "./is-number";
export * from "./is-object-method";
export * from "./is-on-same-line";
export * from "./is-same-identifier";
export * from "./is-same-reference";
export * from "./is-shadowed";
export * from "./is-shorthand-export-local";
export * from "./is-shorthand-import-local";
export * from "./is-shorthand-property-assignment-pattern-left";
export * from "./is-shorthand-property-value";
export * from "./is-value-not-usable";
export * from "./needs-semicolon";
export * from "./numeric";
export * from "./parentheses";
export * from "./resolve-variable-name";
export * from "./rule";
export * from "./should-add-parentheses-to-await-expression-argument";
export * from "./should-add-parentheses-to-call-expression-callee";
export * from "./should-add-parentheses-to-conditional-expression-child";
export * from "./should-add-parentheses-to-expression-statement-expression";
export * from "./should-add-parentheses-to-logical-expression-child";
export * from "./should-add-parentheses-to-member-expression-object";
export * from "./should-add-parentheses-to-new-expression-callee";
export * from "./singular";
export * from "./to-location";

export default {
  reportProblems,
  avoidCapture,
  escapeString,
  getBooleanAncestor,
  getCallExpressionArgumentsText,
  getCallExpressionTokens,
  getParentheses,
  getParenthesizedRange,
  getParenthesizedText,
  getParenthesizedTimes,
  getReferences,
  getScopes,
  getVariableIdentifiers,
  hasOptionalChainElement,
  isArrayPrototypeProperty,
  isBooleanNode,
  isFunctionSelfUsedInside,
  isLeftHandSide,
  isLogicalExpression,
  isMethodNamed,
  isNodeMatches,
  isNodeMatchesNameOrPath,
  isNodeValueNotDomNode,
  isNodeValueNotFunction,
  isObjectPrototypeProperty,
  isOnSameLine,
  isParenthesized,
  isSameIdentifier,
  isSameReference,
  isShadowed,
  isValueNotUsable,
  needsSemicolon,
  shouldAddParenthesesToMemberExpressionObject,
  shouldAddParenthesesToCallExpressionCallee,
  shouldAddParenthesesToAwaitExpressionArgument,
  singular,
  toLocation,
  getAncestor
};
