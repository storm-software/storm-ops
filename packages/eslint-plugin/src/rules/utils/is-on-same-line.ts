export function isOnSameLine(nodeOrTokenA, nodeOrTokenB) {
  return nodeOrTokenA.loc.start.line === nodeOrTokenB.loc.start.line;
}

export default isOnSameLine;
