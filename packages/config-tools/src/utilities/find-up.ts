import { existsSync } from "node:fs";
import { join } from "node:path";

const MAX_PATH_SEARCH_DEPTH = 30;
let depth = 0;

/**
 * Gets the nearest "node_modules" folder by walking up from start path.
 */
export function findFolderUp(
  startPath: string,
  endFileNames: string[] = [],
  endDirectoryNames: string[] = [],
): string | undefined {
  const _startPath = startPath ?? process.cwd();

  if (
    endDirectoryNames.some((endDirName) =>
      existsSync(join(_startPath, endDirName)),
    )
  ) {
    return _startPath;
  }

  if (
    endFileNames.some((endFileName) =>
      existsSync(join(_startPath, endFileName)),
    )
  ) {
    return _startPath;
  }

  if (_startPath !== "/" && depth++ < MAX_PATH_SEARCH_DEPTH) {
    const parent = join(_startPath, "..");
    return findFolderUp(parent, endFileNames, endDirectoryNames);
  }
  return undefined;
}
