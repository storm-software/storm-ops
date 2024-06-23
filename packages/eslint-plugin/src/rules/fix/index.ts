import addParenthesizesToReturnOrThrowExpression from "./add-parenthesizes-to-return-or-throw-expression";
import appendArgument from "./append-argument";
import extendFixRange from "./extend-fix-range";
import fixSpaceAroundKeyword from "./fix-space-around-keywords";
import removeArgument from "./remove-argument";
import removeMemberExpressionProperty from "./remove-member-expression-property";
import removeMethodCall from "./remove-method-call";
import removeParentheses from "./remove-parentheses";
import removeSpacesAfter from "./remove-spaces-after";
import renameVariable from "./rename-variable";
import replaceArgument from "./replace-argument";
import replaceNodeOrTokenAndSpacesBefore from "./replace-node-or-token-and-spaces-before";
import replaceReferenceIdentifier from "./replace-reference-identifier";
import replaceStringLiteral from "./replace-string-literal";
import replaceTemplateElement from "./replace-template-element";
import switchCallExpressionToNewExpression from "./switch-call-expression-to-new-expression";
import switchNewExpressionToCallExpression from "./switch-new-expression-to-call-expression";

export * from "./add-parenthesizes-to-return-or-throw-expression";
export * from "./append-argument";
export * from "./extend-fix-range";
export * from "./fix-space-around-keywords";
export * from "./index";
export * from "./remove-argument";
export * from "./remove-member-expression-property";
export * from "./remove-method-call";
export * from "./remove-parentheses";
export * from "./remove-spaces-after";
export * from "./rename-variable";
export * from "./replace-argument";
export * from "./replace-node-or-token-and-spaces-before";
export * from "./replace-reference-identifier";
export * from "./replace-string-literal";
export * from "./replace-string-raw";
export * from "./replace-template-element";
export * from "./switch-call-expression-to-new-expression";
export * from "./switch-new-expression-to-call-expression";

export default {
  // Utilities
  extendFixRange,
  removeParentheses,
  appendArgument,
  removeArgument,
  replaceArgument,
  switchNewExpressionToCallExpression,
  switchCallExpressionToNewExpression,
  removeMemberExpressionProperty,
  removeMethodCall,
  replaceTemplateElement,
  replaceReferenceIdentifier,
  renameVariable,
  replaceNodeOrTokenAndSpacesBefore,
  removeSpacesAfter,
  fixSpaceAroundKeyword,
  replaceStringLiteral,
  addParenthesizesToReturnOrThrowExpression
};
