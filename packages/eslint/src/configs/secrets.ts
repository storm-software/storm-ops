import { pluginSecrets } from "../plugins";
import type { TypedFlatConfigItem } from "../types";
import { ensurePackages } from "../utils/helpers";

/**
 * Config for No-Secrets ESLint plugin
 */
export async function secrets(options: {
  json: boolean;
}): Promise<TypedFlatConfigItem[]> {
  const { json = true } = options;

  if (json) {
    await ensurePackages(["eslint-plugin-jsonc"]);
  }

  return [
    {
      name: "storm/secrets/rules",
      files: [`**/*.{js,ts,jsx,tsx${json ? ",json,jsonc" : ""}`],
      plugins: {
        "no-secrets": pluginSecrets
      },
      rules: {
        "no-secrets/no-secrets": [
          "error",
          { ignoreIdentifiers: ["nxCloudId"] }
        ] as any
      }
    }
  ];
}
