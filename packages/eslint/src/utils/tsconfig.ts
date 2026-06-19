import { existsSync, statSync } from "node:fs";
import { joinPaths, relative } from "./correct-paths";
import { findWorkspaceRoot } from "./find-workspace-root";

/**
 * Gets the path to the nearest tsconfig file by walking up from start path.
 *
 * The search order is as follows:
 * 1. If `tsconfigPath` is provided and exists, it will be used.
 * 2. If a tsconfig file is found in the current working directory, it will be used.
 * 3. If a tsconfig file is found in the workspace root, it will be used.
 * 4. If no tsconfig file is found, a warning will be logged and a default path will be returned based on the project type (app or lib).
 *
 * The function checks for the following tsconfig file names in order:
 * - tsconfig.json
 * - tsconfig.base.json
 * - tsconfig.app.json
 * - tsconfig.lib.json
 * - tsconfig.eslint.json
 * - tsconfig.lint.json
 *
 * @param tsconfigPath Optional path to a tsconfig file. If provided, it will be used if it exists.
 * @param type The type of project (app or lib) to determine the default tsconfig file name if no tsconfig file is found. Default is "app".
 * @returns The path to the nearest tsconfig file relative to the workspace root.
 */
export function getTsConfigPath(
  tsconfigPath?: string,
  type?: "app" | "lib"
): string {
  const workspaceRoot = findWorkspaceRoot();

  if (
    tsconfigPath &&
    existsSync(tsconfigPath) &&
    statSync(tsconfigPath).isFile()
  ) {
    return relative(workspaceRoot, tsconfigPath);
  }

  let result = checkTsConfigPath(process.cwd());
  if (result) {
    return relative(workspaceRoot, joinPaths(process.cwd(), result));
  }

  result = checkTsConfigPath(workspaceRoot);
  if (result) {
    return relative(workspaceRoot, joinPaths(workspaceRoot, result));
  }

  console.warn(
    `No tsconfig.json found${
      tsconfigPath ? ` provided: ${tsconfigPath}` : ""
    }. Consider adding a tsconfig.json file to your project's ESLint configuration.`
  );

  return workspaceRoot?.replace(/\\/g, "/").replaceAll(/\/$/g, "") ===
    process.cwd().replace(/\\/g, "/").replaceAll(/\/$/g, "")
    ? "tsconfig.base.json"
    : type
      ? `tsconfig.${type}.json`
      : "tsconfig.json";
}

export function checkTsConfigPath(root: string): string | undefined {
  if (existsSync(joinPaths(root, "tsconfig.json"))) {
    return "tsconfig.json";
  } else if (existsSync(joinPaths(root, "tsconfig.base.json"))) {
    return "tsconfig.base.json";
  } else if (existsSync(joinPaths(root, "tsconfig.app.json"))) {
    return "tsconfig.app.json";
  } else if (existsSync(joinPaths(root, "tsconfig.lib.json"))) {
    return "tsconfig.lib.json";
  } else if (existsSync(joinPaths(root, "tsconfig.eslint.json"))) {
    return "tsconfig.eslint.json";
  } else if (existsSync(joinPaths(root, "tsconfig.lint.json"))) {
    return "tsconfig.lint.json";
  }

  return undefined;
}
