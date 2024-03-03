export const correctPaths = (path?: string): string => {
  if (!path) {
    return "";
  }

  if (process.platform === "win32" && path.includes("C:")) {
    return path.replaceAll("/", "\\");
  }

  return path.replaceAll("\\", "/");
};
