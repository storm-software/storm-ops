/**
 * Normalizes a file path to use forward slashes and removes leading './' and trailing '/'.
 *
 * @param path - The path string to normalize
 * @returns The normalized path string
 */
export function normalizePath<T extends string | undefined>(path: T): T {
  if (!path) {
    return path;
  }

  return path.replace(/\\/g, "/").replace(/^\.\//, "").replace(/\/$/, "") as T;
}
