import { Glob, hasMagic } from "glob";
import micromatch from "micromatch";
import { basename } from "node:path";
import { IGNORE_FILES } from "./constants";

export function isObject(object) {
  return Boolean(object) && typeof object === "object";
}

export function filterObjectByKey(
  object: Record<string, any>,
  filterByKey = (key?: string) => true,
  deep = false
) {
  let result = {};
  let changed = false;

  for (const key in object) {
    if (filterByKey(key)) {
      if (deep && isObject(object[key])) {
        result[key] = filterObjectByKey(object[key], filterByKey, deep);

        if (result[key] !== object[key]) {
          changed = true;
        }
      } else {
        result[key] = object[key];
      }
    } else {
      changed = true;
    }
  }

  return changed ? result : object;
}

export function createIgnoreMatcher(ignorePattern: string | RegExp = "**/*") {
  if (ignorePattern instanceof RegExp) {
    return filename => !ignorePattern.test(filename);
  }

  if (hasMagic(ignorePattern, { magicalBraces: true })) {
    const isMatch = micromatch.matcher(ignorePattern);

    return (_filename, path) => !isMatch(path);
  }

  return filename => filename !== ignorePattern;
}

export async function createFilesFilter(ignoreFiles: string = "", cwd: string) {
  let ignoreFilesList = [] as string[];

  if (ignoreFiles) {
    const glob = new Glob(ignoreFiles, { cwd });
    ignoreFilesList = await glob.walk();
  }

  const ignorePatterns =
    ignoreFilesList.length > 0
      ? IGNORE_FILES.concat(...ignoreFilesList).filter(Boolean)
      : IGNORE_FILES;
  const filter = ignorePatterns.reduce(
    (
      next: null | ((filename: string, path: string) => void),
      ignorePattern
    ) => {
      const ignoreMatcher = createIgnoreMatcher(ignorePattern);

      if (!next) {
        return ignoreMatcher;
      }

      return (filename: string, path: string) =>
        ignoreMatcher(filename, path) && next && next(filename, path);
    },
    null
  );

  return path => {
    const filename = basename(path);

    return filter?.(filename, path);
  };
}
