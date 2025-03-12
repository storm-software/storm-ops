import { pluginPnpm } from "../plugins";
import type { OptionsPnpm, TypedFlatConfigItem } from "../types";
import { ensurePackages, interopDefault } from "../utils/helpers";

export async function pnpm(
  options: OptionsPnpm = {}
): Promise<TypedFlatConfigItem[]> {
  const { overrides = {}, ignore = ["typescript"] } = options;

  await ensurePackages(["jsonc-eslint-parser", "yaml-eslint-parser"]);

  const [parserJsonc, parserYaml] = await Promise.all([
    interopDefault(import("jsonc-eslint-parser")),
    interopDefault(import("yaml-eslint-parser"))
  ] as const);

  return [
    {
      name: "storm/pnpm/setup",
      plugins: {
        pnpm: pluginPnpm
      }
    },
    {
      name: "storm/pnpm/package-json",
      ignores: ["**/node_modules/**", "**/dist/**"],
      files: ["package.json", "**/package.json"],
      languageOptions: {
        parser: parserJsonc
      },
      rules: {
        "pnpm/json-enforce-catalog": [
          "error",
          {
            ignore,
            autofix: true,
            allowedProtocols: ["workspace", "link", "file"],
            defaultCatalog: "default",
            reuseExistingCatalog: true,
            conflicts: "new-catalog",
            fields: ["dependencies", "devDependencies"]
          }
        ],
        "pnpm/json-valid-catalog": "error",
        "pnpm/json-prefer-workspace-settings": "error",

        ...overrides
      }
    },
    {
      name: "storm/pnpm/pnpm-workspace-yaml",
      ignores: ["**/node_modules/**", "**/dist/**"],
      files: ["pnpm-workspace.yaml", "**/pnpm-workspace.yaml"],
      languageOptions: {
        parser: parserYaml
      },
      rules: {
        "pnpm/yaml-no-unused-catalog-item": "error",
        "pnpm/yaml-no-duplicate-catalog-item": "error",

        ...overrides
      }
    }
  ];
}
