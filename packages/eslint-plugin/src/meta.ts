import { join } from "node:path";
import { existsSync, readJsonFile } from "fs-extra";
import type { StormESLintPluginMeta } from "./types";

function findPackageJson() {
  try {
    const packageJsonPath = join(__dirname, "package.json");
    if (!existsSync(packageJsonPath)) {
      return null;
    }

    return readJsonFile(packageJsonPath);
  } catch (e) {
    console.log(e);
    return null;
  }
}

const packageJson = findPackageJson();

const meta: StormESLintPluginMeta = {
  name: packageJson?.name ? packageJson.name : "@storm-software/eslint-plugin",
  version: packageJson?.version ? packageJson.version : "0.0.1"
};

export default meta;
