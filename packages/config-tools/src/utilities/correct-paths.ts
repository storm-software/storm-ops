/**
 * Normalizes the given path.
 *
 * @remarks
 * Removes duplicate slashes, removes trailing slashes, adds a leading slash.
 *
 * @param path - The path to normalize
 * @returns The normalized path
 */
export function correctPaths(
  path: string,
  platform = process.platform
): string {
  path = path[0] === "/" ? path : "/" + path;
  path = path.length > 1 && path.at(-1) === "/" ? path.slice(0, -1) : path;
  path = path.replace(/\/+/g, "/");

  if (platform === "win32" && path.startsWith("/C:")) {
    path = path.slice(1);
  }

  return path;
}

/**
 * Join the given paths
 *
 * @param paths - The paths to join
 * @returns The joined paths
 */
export const joinPaths = (...paths: string[]): string => {
  return (
    "/" +
    paths
      .map(v => correctPaths(v).slice(1))
      .filter(Boolean)
      .join("/")
  );
};
