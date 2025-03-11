import type { OptionsOverrides, TypedFlatConfigItem } from "../types";
import { interopDefault } from "../utils/helpers";

export async function pnpm(
  options: OptionsOverrides = {}
): Promise<TypedFlatConfigItem[]> {
  const { overrides = {} } = options;

  const [pluginPnpm, parserJsonc] = await Promise.all([
    interopDefault(import("eslint-plugin-pnpm")),
    interopDefault(import("jsonc-eslint-parser"))
  ] as const);

  return [
    {
      name: "storm/pnpm",
      plugins: {
        pnpm: pluginPnpm
      },
      ignores: ["**/node_modules/**", "**/dist/**"],
      files: ["package.json", "**/package.json"],
      languageOptions: {
        parser: parserJsonc
      },
      rules: {
        "pnpm/enforce-catalog": "error",
        "pnpm/valid-catalog": "error",
        "pnpm/prefer-workspace-settings": "error",

        ...overrides
      }
    }
  ];
}
