import { GLOB_TS, GLOB_TSX } from "@storm-software/package-constants/globs";
import type { OptionsFiles, OptionsTSDoc, TypedFlatConfigItem } from "../types";
import { findWorkspaceRoot } from "../utils/find-workspace-root";
import { ensurePackages, interopDefault } from "../utils/helpers";

export async function tsdoc(
  options: OptionsFiles & OptionsTSDoc = {}
): Promise<TypedFlatConfigItem[]> {
  const {
    severity = "error",
    type = "recommended",
    configFile,
    files = [GLOB_TS, GLOB_TSX]
  } = options;

  await ensurePackages(["@storm-software/eslint-plugin-tsdoc"]);

  const [pluginTsdoc] = await Promise.all([
    interopDefault(import("@storm-software/eslint-plugin-tsdoc"))
  ] as const);

  return [
    {
      files,
      name: "storm/tsdoc/rules",
      plugins: {
        tsdoc: pluginTsdoc
      },
      rules: {
        "tsdoc/syntax": [
          severity,
          { type, configFile, tsconfigRootDir: findWorkspaceRoot() }
        ]
      }
    }
  ];
}
