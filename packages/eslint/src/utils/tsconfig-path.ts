import { existsSync, statSync } from "node:fs";
import { joinPaths, relative } from "./correct-paths";
import { findWorkspaceRoot } from "./find-workspace-root";

export function getTsConfigPath(
  tsconfigPath?: string,
  type: "app" | "lib" = "app"
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
    return result;
  }

  console.warn(
    `No tsconfig.json found${
      tsconfigPath ? ` provided: ${tsconfigPath}` : ""
    }. Consider adding a tsconfig.json file to your project's ESLint configuration.`
  );

  return workspaceRoot?.replace(/\\/g, "/").replaceAll(/\/$/g, "") ===
    process.cwd().replace(/\\/g, "/").replaceAll(/\/$/g, "")
    ? "tsconfig.base.json"
    : `tsconfig.${type}.json`;
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
