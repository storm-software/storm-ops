import type { OptionsPNPM, TypedConfigItem } from "../types";

export function pnpm(options: OptionsPNPM): TypedConfigItem {
  return {
    jsPlugins: [
      {
        name: "pnpm",
        specifier: "@storm-software/eslint-plugin-pnpm"
      }
    ],
    rules: {
      "pnpm/json-enforce-catalog": [
        "error",
        {
          ignore: options.ignore,
          autofix: true,
          allowedProtocols: ["workspace", "link", "file"],
          defaultCatalog: "default",
          reuseExistingCatalog: true,
          conflicts: "overrides",
          fields: ["dependencies", "devDependencies"]
        }
      ],
      "pnpm/json-valid-catalog": "error",
      "pnpm/json-prefer-workspace-settings": "error",
      "pnpm/yaml-no-unused-catalog-item": "error",
      "pnpm/yaml-no-duplicate-catalog-item": "error"
    }
  };
}
