import { normalizeWindowsPath } from "./correct-paths";

export const removeExtension = (filePath?: string): string => {
  const result =
    !filePath || (filePath?.match(/./g) || []).length <= 1
      ? "."
      : filePath.lastIndexOf(".")
        ? filePath.substring(0, filePath.lastIndexOf("."))
        : filePath;

  if (result.startsWith("./")) {
    return result.substring(2);
  }
  if (result.startsWith(".") || result.startsWith("/")) {
    return result.substring(1);
  }

  return result;
};

export interface FindFileNameOptions {
  /**
   * Require the file extension to be present in the file name.
   *
   * @defaultValue false
   */
  requireExtension?: boolean;

  /**
   * Return the file extension as part of the full file name result.
   *
   * @defaultValue true
   */
  withExtension?: boolean;
}

/**
 * Find the file name from a file path.
 *
 * @example
 * ```ts
 * const fileName = findFileName("C:\\Users\\user\\Documents\\file.txt");
 * // fileName = "file.txt"
 * ```
 *
 * @param filePath - The file path to process
 * @param options - The options to use when processing the file name
 * @returns The file name
 */
export function findFileName(
  filePath: string,
  { requireExtension, withExtension }: FindFileNameOptions = {}
): string {
  const result =
    normalizeWindowsPath(filePath)
      ?.split(filePath?.includes("\\") ? "\\" : "/")
      ?.pop() ?? "";

  if (requireExtension === true && !result.includes(".")) {
    return "";
  }

  if (withExtension === false && result.includes(".")) {
    return result.split(".").slice(-1).join(".") || "";
  }

  return result;
}

/**
 * Find the full file path's directories from a file path.
 *
 * @example
 * ```ts
 * const folderPath = findFilePath("C:\\Users\\user\\Documents\\file.txt");
 * // folderPath = "C:\\Users\\user\\Documents"
 * ```
 *
 * @param filePath - The file path to process
 * @returns The full file path's directories
 */
export function findFilePath(filePath: string): string {
  const normalizedPath = normalizeWindowsPath(filePath);

  return normalizedPath.replace(
    findFileName(normalizedPath, { requireExtension: true }),
    ""
  );
}
