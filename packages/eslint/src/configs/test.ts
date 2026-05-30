import { pluginNoOnlyTests, pluginVitest } from "../plugins";
import type {
  OptionsFiles,
  OptionsIsInEditor,
  OptionsOverrides,
  TypedFlatConfigItem
} from "../types";
import { GLOB_TESTS } from "../utils/constants";

// Hold the reference so we don't redeclare the plugin on each call
let plugin: any;

export async function test(
  options: OptionsFiles & OptionsIsInEditor & OptionsOverrides = {}
): Promise<TypedFlatConfigItem[]> {
  const { files = GLOB_TESTS, isInEditor = false, overrides = {} } = options;

  plugin = plugin || {
    ...pluginVitest,
    rules: {
      ...pluginVitest.rules,
      // extend `test/no-only-tests` rule
      ...pluginNoOnlyTests.rules
    }
  };

  return [
    {
      name: "storm/test/setup",
      plugins: {
        test: plugin
      }
    },
    {
      files,
      name: "storm/test/rules",
      rules: {
        ...Object.entries(pluginVitest.configs.recommended.rules).reduce(
          (acc, [key, value]) => {
            acc[key.replace("vitest/", "test/")] = value;
            return acc;
          },
          {} as Record<string, any>
        ),
        "test/consistent-test-it": [
          "error",
          { fn: "it", withinDescribe: "it" }
        ],
        "test/no-identical-title": "error",
        "test/no-import-node-test": "error",
        "test/no-only-tests": isInEditor ? "warn" : "error",

        "test/prefer-hooks-in-order": "error",
        "test/prefer-lowercase-title": "error",

        // Disables
        "no-unused-expressions": "off",
        "node/prefer-global/process": "off",
        "ts/explicit-function-return-type": "off",

        ...overrides
      }
    }
  ];
}
