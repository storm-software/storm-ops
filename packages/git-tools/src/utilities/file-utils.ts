import Path, { dirname, isAbsolute, join } from "node:path";

export function findFileName(filePath: string): string {
  return (
    filePath
      ?.split(
        filePath?.includes(Path.sep)
          ? Path.sep
          : filePath?.includes("/")
            ? "/"
            : "\\",
      )
      ?.pop() ?? ""
  );
}

export function findFilePath(filePath: string): string {
  return filePath.replace(findFileName(filePath), "");
}

export function resolvePath(filePath: string, basePath?: string) {
  if (isAbsolute(filePath)) {
    return filePath;
  }
  if (basePath) {
    return join(dirname(basePath), filePath);
  }

  return null;
}

/**
 * Rename the file name with a new name.
 *
 * @param filePath The current file path being processed
 * @param newFileName The updated file name being processed
 * @returns The modified or unmodified file path.
 */
export function renameFile(filePath: string, newFileName: string): string {
  const file = Path.parse(filePath);
  return Path.join(
    file.dir,
    newFileName.includes(".") ? newFileName : newFileName + file.ext,
  );
}
