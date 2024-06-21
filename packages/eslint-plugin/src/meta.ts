// import { join } from "node:path";
import type { StormESLintPluginMeta } from "./types";

const DEFAULT_META: StormESLintPluginMeta = {
  name: "@storm-software/eslint-plugin",
  version: "0.0.1"
};

let meta = { ...DEFAULT_META };

// try {
//   const findPackageJson = async () => {
//     const { existsSync, readJsonFile } = await import("fs-extra");

//     const packageJsonPath = join(__dirname, "package.json");
//     if (!existsSync(packageJsonPath)) {
//       return null;
//     }

//     return readJsonFile(packageJsonPath);
//   };
//   const packageJson = await findPackageJson();

//   meta = {
//     name: packageJson?.name ? packageJson.name : DEFAULT_META.name,
//     version: packageJson?.version ? packageJson.version : DEFAULT_META.version
//   };
// } catch (e) {
//   console.error("Failed to read package.json");
//   console.error(e);
//   meta = { ...DEFAULT_META };
// }

export default meta;
