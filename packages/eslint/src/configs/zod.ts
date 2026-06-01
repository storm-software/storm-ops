import { pluginImportZod } from "../plugins";
import type { OptionsOverrides, TypedFlatConfigItem } from "../types";
import { GLOB_SRC } from "../utils/constants";

/**
 * Config for Import-Zod ESLint plugin
 */
export async function zod(
  options: OptionsOverrides = {}
): Promise<TypedFlatConfigItem[]> {
  const { overrides = {} } = options;

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
