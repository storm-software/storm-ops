import { locatePath, locatePathSync } from "locate-path";
import { dirname, parse, resolve } from "path";
import { fileURLToPath } from "url";

export interface FindUpOptions {
  cwd?: string;
  type: "file" | "directory";
  stopAt?: string;
  limit: number;
}

export const findUpStop = Symbol("findUpStop");

function toPath(urlOrPath) {
  return urlOrPath instanceof URL ? fileURLToPath(urlOrPath) : urlOrPath;
}

export async function findUpMultiple(
  names:
    | string
    | string[]
    | ((cwd: string) => string)
    | ((cwd: string) => string)[],
  options: FindUpOptions = { limit: Number.POSITIVE_INFINITY, type: "file" }
) {
  let directory = resolve(toPath(options.cwd) ?? "");
  const { root } = parse(directory);
  const stopAt = resolve(directory, toPath(options.stopAt ?? root));
  const limit = options.limit ?? Number.POSITIVE_INFINITY;

  if (typeof names === "function") {
    const foundPath = names(options.cwd);

    return locatePathSync([foundPath], { ...options, cwd: directory });
  }

  const runNameMatcher = async (name: string | ((cwd: string) => string)) => {
    const paths = [name].flat();

    const runMatcher = async locateOptions => {
      if (typeof name !== "function") {
        return locatePath(paths as string[], locateOptions);
      }

      const foundPath = await name(locateOptions.cwd);
      if (typeof foundPath === "string") {
        return locatePath([foundPath], locateOptions);
      }

      return foundPath;
    };

    const matches: string[] = [];
    while (true) {
      console.debug(
        `Searching for workspace root files in ${directory} \nOptions: ${JSON.stringify(
          options
        )}`
      );

      const foundPath = await runMatcher({ ...options, cwd: directory });
      console.debug(`Found path specified at ${foundPath}`);

      if (foundPath) {
        matches.push(resolve(directory, foundPath));
      }

      if (directory === stopAt || matches.length >= limit) {
        break;
      }

      directory = dirname(directory);
    }

    return matches;
  };

  const promises = Promise.all(
    (
      (names && Array.isArray(names) ? names : [names]) as
        | string[]
        | ((cwd: string) => string)[]
    ).map((name: string | ((cwd: string) => string)) => runNameMatcher(name))
  );
  return (await promises).flat().map(path => (path ? path : ""));
}

export function findUpMultipleSync(
  names:
    | string
    | string[]
    | ((cwd: string) => string)
    | ((cwd: string) => string)[],
  options: FindUpOptions = { limit: 1, type: "file" }
) {
  let directory = resolve(toPath(options.cwd) ?? "");
  const { root } = parse(directory);
  const stopAt = resolve(directory, toPath(options.stopAt) ?? root);
  const limit = options.limit ?? Number.POSITIVE_INFINITY;

  if (typeof names === "function") {
    const foundPath = names(options.cwd);

    return locatePathSync([foundPath], options);
  }

  const runNameMatcher = (name: string | ((cwd: string) => string)) => {
    const paths = [name].flat();

    const runMatcher = locateOptions => {
      if (typeof name !== "function") {
        return locatePathSync(paths as string[], locateOptions);
      }

      const foundPath = name(locateOptions.cwd);
      if (typeof foundPath === "string") {
        return locatePathSync([foundPath], locateOptions);
      }

      return foundPath;
    };

    const matches: string[] = [];
    while (true) {
      const foundPath = runMatcher({ ...options, cwd: directory });
      if (foundPath) {
        matches.push(resolve(directory, foundPath));
      }

      if (directory === stopAt || matches.length >= limit) {
        break;
      }

      directory = dirname(directory);
    }

    return matches;
  };

  return (
    (names && Array.isArray(names) ? names : [names]) as
      | string[]
      | ((cwd: string) => string)[]
  )
    .map((name: string | ((cwd: string) => string)) => runNameMatcher(name))
    .flat()
    .map(path => (path ? path : ""));
}

export async function findUp(
  names:
    | string
    | string[]
    | ((cwd: string) => string)
    | ((cwd: string) => string)[],
  options: FindUpOptions = { limit: 1, type: "file" }
) {
  const matches = await findUpMultiple(names, options);
  return matches[0];
}

export function findUpSync(
  names:
    | string
    | string[]
    | ((cwd: string) => string)
    | ((cwd: string) => string)[],
  options: FindUpOptions = { limit: 1, type: "file" }
) {
  const matches = findUpMultipleSync(names, options);
  return matches[0];
}
