import { FlatCompat } from "@eslint/eslintrc";
import nxPlugin from "@nx/eslint-plugin";
import typescriptConfigs from "@nx/eslint-plugin/src/configs/typescript.js";
import { findWorkspaceRoot } from "@storm-software/config-tools";
import type { Linter } from "eslint";
import base from "./base";
import { formatConfig } from "./utils/format-config";
import { DEFAULT_IGNORES } from "./utils/ignores";

const workspaceRoot = findWorkspaceRoot();
const compat = new FlatCompat({
  baseDirectory: workspaceRoot,
  recommendedConfig: typescriptConfigs,
  ignores: DEFAULT_IGNORES
});

const config: Linter.FlatConfig[] = [
  ...base,
  { plugins: { "@nx": nxPlugin } },
  ...compat.plugins("@nx").map(config => ({
    ...config,
    files: [
      "**/*.ts",
      "**/*.mts",
      "**/*.cts",
      "**/*.tsx",
      "**/*.cjs",
      "**/*.js",
      "**/*.jsx"
    ],
    ignores: DEFAULT_IGNORES,
    rules: {
      ...config.rules,
      "@nx/enforce-module-boundaries": [
        "error",
        {
          enforceBuildableLibDependency: true,
          "checkDynamicDependenciesExceptions": [".*"],
          allow: [],
          depConstraints: [
            {
              sourceTag: "*",
              onlyDependOnLibsWithTags: ["*"]
            }
          ]
        }
      ],
      "@typescript-eslint/explicit-module-boundary-types": "off",
      "no-restricted-imports": ["error", "create-nx-workspace"],
      "@typescript-eslint/no-restricted-imports": [
        "error",
        {
          "patterns": [
            {
              "group": ["nx/src/plugins/js*"],
              "message":
                "Imports from 'nx/src/plugins/js' are not allowed. Use '@nx/js' instead"
            },
            {
              "group": ["**/native-bindings", "**/native-bindings.js", ""],
              "message":
                "Direct imports from native-bindings.js are not allowed. Import from index.js instead."
            }
          ]
        }
      ]
    }
  }))
];

export default formatConfig("Nx", config);
