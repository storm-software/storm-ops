export const correctPaths = (path?: string): string => {
  if (!path) {
    return "";
  }

  // Handle Windows absolute paths
  if (path.toUpperCase().startsWith("C:")) {
    return path.replaceAll("/", "\\");
  } else if (path.includes("\\")) {
    return `C:${path.replaceAll("/", "\\")}`;
  }

  return path.replaceAll("\\", "/");
};
