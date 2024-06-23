import hasSameRange from "./has-same-range";

const isShorthandExportLocal = node => {
  const { type, local, exported } = node.parent;
  return (
    type === "ExportSpecifier" &&
    hasSameRange(local, exported) &&
    local === node
  );
};

export default isShorthandExportLocal;
