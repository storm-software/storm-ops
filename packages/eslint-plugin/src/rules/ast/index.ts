import {
  isCallExpression,
  isCallOrNewExpression,
  isNewExpression
} from "./call-or-new-expression";
import functionTypes from "./function-types";
import isArrowFunctionBody from "./is-arrow-function-body";
import isDirective from "./is-directive";
import isEmptyNode from "./is-empty-node";
import isExpressionStatement from "./is-expression-statement";
import isFunction from "./is-function";
import isMemberExpression from "./is-member-expression";
import isMethodCall from "./is-method-call";
import isReferenceIdentifier from "./is-reference-identifier";
import isStaticRequire from "./is-static-require";
import isTaggedTemplateLiteral from "./is-tagged-template-literal";
import isUndefined from "./is-undefined";
import {
  isBigIntLiteral,
  isLiteral,
  isNullLiteral,
  isNumberLiteral,
  isRegexLiteral,
  isStringLiteral
} from "./literal";

export * from "./call-or-new-expression";
export * from "./function-types";
export * from "./is-arrow-function-body";
export * from "./is-directive";
export * from "./is-empty-node";
export * from "./is-expression-statement";
export * from "./is-function";
export * from "./is-member-expression";
export * from "./is-method-call";
export * from "./is-reference-identifier";
export * from "./is-static-require";
export * from "./is-tagged-template-literal";
export * from "./is-undefined";
export * from "./literal";

const ast = {
  isLiteral,
  isStringLiteral,
  isNumberLiteral,
  isBigIntLiteral,
  isNullLiteral,
  isRegexLiteral,
  isArrowFunctionBody,
  isCallExpression,
  isCallOrNewExpression,
  isDirective,
  isEmptyNode,
  isExpressionStatement,
  isFunction,
  isMemberExpression,
  isMethodCall,
  isNewExpression,
  isReferenceIdentifier,
  isStaticRequire,
  isTaggedTemplateLiteral,
  isUndefined,
  functionTypes
};

export default ast;
