import { pluginImportZod } from "../plugins";
import type { OptionsOverrides, TypedFlatConfigItem } from "../types";
import { GLOB_SRC } from "../utils/constants";
import { ensurePackages } from "../utils/helpers";

/**
 * Config for Import-Zod ESLint plugin
 */
export async function zod(
  options: OptionsOverrides = {}
): Promise<TypedFlatConfigItem[]> {
  const { overrides = {} } = options;

  await ensurePackages(["eslint-plugin-import-zod"]);

  return [
    {
      name: "storm/zod/rules",
      files: [GLOB_SRC],
      plugins: {
        "import-zod": pluginImportZod
      },
      rules: {
        "import-zod/prefer-zod-namespace": "error"
      },

      ...overrides
    }
  ];
}
