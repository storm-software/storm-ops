import { pluginSecrets } from "src/plugins";
import { ensurePackages, interopDefault } from "src/utils/helpers";
import type { TypedFlatConfigItem } from "../types";

/**
 * Config for No-Secrets ESLint plugin
 */
export async function secrets(options: {
  json: boolean;
}): Promise<TypedFlatConfigItem[]> {
  const { json = true } = options;

  await ensurePackages(["eslint-plugin-jsonc"]);

  const [pluginJsonc] = await Promise.all([
    interopDefault(import("eslint-plugin-jsonc"))
  ] as const);

  return [
    ...(json ? pluginJsonc.configs["flat/recommended-with-jsonc"] : []),
    {
      name: "storm/secrets/rules",
      files: [`**/*.{js,ts,jsx,tsx${json ? ",json,jsonc" : ""}`],
      plugins: {
        "no-secrets": pluginSecrets
      },
      rules: {
        "no-secrets/no-secrets": [
          "error",
          { "ignoreIdentifiers": ["nxCloudId"] }
        ]
      }
    }
  ];
}
