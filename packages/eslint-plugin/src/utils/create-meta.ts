import { join } from "node:path";
import { existsSync, readJsonFileSync } from "fs-extra";
import type { StormESLintPluginMeta } from "../types";

const DefaultMeta: StormESLintPluginMeta = {
  name: "eslint-plugin-storm-software",
  version: "0.0.1"
};

export const createMeta = (): StormESLintPluginMeta => {
  try {
    const packageJsonPath = join(__dirname, "package.json");
    if (!existsSync(packageJsonPath)) {
      return { ...DefaultMeta };
    }

    const packageJson = readJsonFileSync(packageJsonPath);

    return {
      name: packageJson?.name ? packageJson.name : DefaultMeta.name,
      version: packageJson?.version ? packageJson.version : DefaultMeta.version
    };
  } catch (e) {
    console.error("Failed to read package.json");
    console.error(e);
    return { ...DefaultMeta };
  }
};
