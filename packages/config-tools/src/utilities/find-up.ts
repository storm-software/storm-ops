import { existsSync } from "fs";
import { join } from "path";

const MAX_PATH_SEARCH_DEPTH = 30;
let depth = 0;

/**
 * Gets the nearest "node_modules" folder by walking up from start path.
 */
export function findFolderUp(
  startPath: string,
  endFileNames: string[]
): string | undefined {
  startPath = startPath ?? process.cwd();

  if (
    endFileNames.some(endFileName => existsSync(join(startPath, endFileName)))
  ) {
    return startPath;
  } else if (startPath !== "/" && depth++ < MAX_PATH_SEARCH_DEPTH) {
    const parent = join(startPath, "..");
    return findFolderUp(parent, endFileNames);
  } else {
    return undefined;
  }
}
