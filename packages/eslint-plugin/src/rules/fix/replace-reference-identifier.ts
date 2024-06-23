import isShorthandExportLocal from "../utils/is-shorthand-export-local";
import isShorthandImportLocal from "../utils/is-shorthand-import-local";
import isShorthandPropertyAssignmentPatternLeft from "../utils/is-shorthand-property-assignment-pattern-left";
import isShorthandPropertyValue from "../utils/is-shorthand-property-value";

export function replaceReferenceIdentifier(identifier, replacement, fixer) {
  if (
    isShorthandPropertyValue(identifier) ||
    isShorthandPropertyAssignmentPatternLeft(identifier)
  ) {
    return fixer.replaceText(identifier, `${identifier.name}: ${replacement}`);
  }

  if (isShorthandImportLocal(identifier)) {
    return fixer.replaceText(
      identifier,
      `${identifier.name} as ${replacement}`
    );
  }

  if (isShorthandExportLocal(identifier)) {
    return fixer.replaceText(
      identifier,
      `${replacement} as ${identifier.name}`
    );
  }

  // `typeAnnotation`
  if (identifier.typeAnnotation) {
    return fixer.replaceTextRange(
      [identifier.range[0], identifier.typeAnnotation.range[0]],
      `${replacement}${identifier.optional ? "?" : ""}`
    );
  }

  return fixer.replaceText(identifier, replacement);
}

export default replaceReferenceIdentifier;
