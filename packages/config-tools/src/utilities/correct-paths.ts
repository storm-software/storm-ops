export const correctPaths = (path?: string): string => {
  if (!path) {
    return "";
  }

  // Handle Windows absolute paths
  if (!path.toUpperCase().startsWith("C:") && path.includes("\\")) {
    path = `C:${path}`;
  }

  return path.replaceAll("\\", "/");
};
