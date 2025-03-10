import { existsSync } from "node:fs";
import { joinPaths } from "./correct-paths";

export function getTsConfigPath(basePath = "./"): string {
  let tsconfigPath = "tsconfig.json";
  if (existsSync(joinPaths(basePath, "tsconfig.base.json"))) {
    tsconfigPath = "tsconfig.base.json";
  } else if (existsSync(joinPaths(basePath, "tsconfig.app.json"))) {
    tsconfigPath = "tsconfig.app.json";
  } else if (existsSync(joinPaths(basePath, "tsconfig.lib.json"))) {
    tsconfigPath = "tsconfig.lib.json";
  } else {
    console.warn(
      "No tsconfig.json found. Consider adding a tsconfig.json file to your project's ESLint configuration."
    );
  }

  return tsconfigPath;
}
