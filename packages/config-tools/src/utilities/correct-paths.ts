import { join } from "node:path";

const removeWindowsDriveLetter = (osSpecificPath: string): string => {
  return osSpecificPath.replace(/^[A-Z]:/, "");
};

/**
 * Corrects any inconsistencies in the path's separators
 *
 * @param path - The path to correct
 * @returns The corrected path
 */
export const correctPaths = (path?: string): string => {
  if (!path) {
    return "";
  }

  // Handle Windows absolute paths
  if (path.includes("\\")) {
    if (!path.toUpperCase().startsWith("C:")) {
      path = `C:${path}`;
    }

    return path.replaceAll("/", "\\");
  }

  return removeWindowsDriveLetter(path).split("\\").join("/");
};

/**
 * Join multiple path segments together
 *
 * @remarks
 * This function also corrects any inconsistencies in the path's separators
 *
 * @param paths - The path segments to join
 * @returns The joined path
 */
export const joinPaths = (...paths: string[]): string => {
  if (!paths || paths.length === 0) {
    return "";
  }

  return correctPaths(join(...paths));
};
