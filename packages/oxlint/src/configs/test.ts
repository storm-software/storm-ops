import type { OptionsTest, TypedConfigItem } from "../types";
import { GLOB_TEST } from "../utils/constants";

export function test(
  options: OptionsTest = {},
  enabled: { vitest?: boolean; jest?: boolean } = {}
): TypedConfigItem {
  const { testFiles = GLOB_TEST } = options;
  const plugins = [
    ...(enabled.jest ? (["jest"] as const) : []),
    ...(enabled.vitest ? (["vitest"] as const) : [])
  ];

  return {
    ...(plugins.length > 0 ? { plugins } : {}),
    overrides: [
      {
        env: {
          jest: !!enabled.jest,
          vitest: !!enabled.vitest
        },
        files: testFiles,
        rules: {
          ...(enabled.jest ? { "jest/no-disabled-tests": "warn" } : {}),
          ...(enabled.vitest ? { "vitest/no-focused-tests": "error" } : {})
        }
      }
    ]
  };
}
