import type { TypedFlatConfigItem } from "../types";
import { GLOB_SRC, GLOB_SRC_EXT } from "../utils/constants";

export async function disables(): Promise<TypedFlatConfigItem[]> {
  return [
    {
      files: [`**/scripts/${GLOB_SRC}`],
      name: "storm/disables/scripts",
      rules: {
        "no-console": "off",
        "ts/explicit-function-return-type": "off"
      }
    },
    {
      files: [`**/cli/${GLOB_SRC}`, `**/cli.${GLOB_SRC_EXT}`],
      name: "storm/disables/cli",
      rules: {
        "no-console": "off"
      }
    },
    {
      files: ["**/*.d.?([cm])ts"],
      name: "storm/disables/dts",
      rules: {
        "eslint-comments/no-unlimited-disable": "off",
        "import/no-duplicates": "off",
        "no-restricted-syntax": "off",
        "unused-imports/no-unused-vars": "off"
      }
    },
    {
      files: ["**/*.js", "**/*.cjs"],
      name: "storm/disables/cjs",
      rules: {
        "ts/no-require-imports": "off"
      }
    },
    {
      files: [`**/*.config.${GLOB_SRC_EXT}`, `**/*.config.*.${GLOB_SRC_EXT}`],
      name: "storm/disables/config-files",
      rules: {
        "no-console": "off",
        "ts/explicit-function-return-type": "off"
      }
    }
  ];
}
