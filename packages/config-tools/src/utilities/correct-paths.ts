export const correctPaths = (path?: string): string | undefined => {
  if (!path) {
    return path;
  }

  if (process.platform === "win32" && path.includes("C:")) {
    return path.replaceAll("/", "\\");
  }

  return path.replaceAll("\\", "/");
};
