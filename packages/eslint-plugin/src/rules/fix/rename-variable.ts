import getVariableIdentifiers from "../utils/get-variable-identifiers";
import replaceReferenceIdentifier from "./replace-reference-identifier";

export const renameVariable = (variable, name, fixer) =>
  getVariableIdentifiers(variable).map(identifier =>
    replaceReferenceIdentifier(identifier, name, fixer)
  );

export default renameVariable;
