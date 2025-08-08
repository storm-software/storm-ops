import { existsSync, statSync } from "node:fs";
import { joinPaths } from "./correct-paths";

export function getTsConfigPath(
  tsconfigPath = "./",
  workspaceRoot = "./"
): string {
  let result = "tsconfig.json";
  if (
    tsconfigPath &&
    existsSync(tsconfigPath) &&
    statSync(tsconfigPath).isFile()
  ) {
    result = tsconfigPath;
  } else if (
    tsconfigPath === workspaceRoot &&
    existsSync(joinPaths(workspaceRoot, "tsconfig.base.json"))
  ) {
    result = "tsconfig.base.json";
  } else if (existsSync(joinPaths(tsconfigPath, "tsconfig.app.json"))) {
    result = "tsconfig.app.json";
  } else if (existsSync(joinPaths(tsconfigPath, "tsconfig.lib.json"))) {
    result = "tsconfig.lib.json";
  } else if (existsSync(joinPaths(workspaceRoot, "tsconfig.base.json"))) {
    result = "tsconfig.base.json";
  } else {
    console.warn(
      `No tsconfig.json found${
        tsconfigPath !== "./" ? ` provided: ${tsconfigPath}` : ""
      }. Consider adding a tsconfig.json file to your project's ESLint configuration.`
    );
  }

  return result;
}
