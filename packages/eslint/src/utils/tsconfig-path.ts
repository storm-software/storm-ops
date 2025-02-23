import { existsSync } from "node:fs";

export function getTsConfigPath() {
  let tsconfigPath = "tsconfig.json";
  if (existsSync("tsconfig.base.json")) {
    tsconfigPath = "tsconfig.base.json";
  } else if (existsSync("tsconfig.app.json")) {
    tsconfigPath = "tsconfig.app.json";
  } else if (existsSync("tsconfig.lib.json")) {
    tsconfigPath = "tsconfig.lib.json";
  } else {
    console.warn(
      "No tsconfig.json found. Consider adding a tsconfig.json file to your project's ESLint configuration."
    );
  }

  return tsconfigPath;
}
