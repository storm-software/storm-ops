// Get identifiers of given variable
export const getVariableIdentifiers = ({ identifiers, references }) => [
  ...new Set([
    ...identifiers,
    ...references.map(({ identifier }) => identifier)
  ])
];
export default getVariableIdentifiers;
