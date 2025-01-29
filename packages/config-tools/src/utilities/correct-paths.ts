import { join, normalize } from "pathe";

/**
 * Normalizes the given path.
 *
 * @remarks
 * Removes duplicate slashes, removes trailing slashes, adds a leading slash.
 *
 * @param path - The path to normalize
 * @returns The normalized path
 */
export function correctPaths(path?: string): string {
  if (!path) {
    return "/";
  }

  return normalize(path);
}

/**
 * Join the given paths
 *
 * @param paths - The paths to join
 * @returns The joined paths
 */
export const joinPaths = (...paths: string[]): string => {
  return join(...paths);
};
