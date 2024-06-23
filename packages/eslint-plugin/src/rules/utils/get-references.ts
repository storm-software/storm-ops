import getScopes from "./get-scopes";

const getReferences = scope => [
  ...new Set(getScopes(scope).flatMap(({ references }) => references))
];

export default getReferences;
