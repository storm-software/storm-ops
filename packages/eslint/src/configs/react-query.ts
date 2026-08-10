import type { OptionsReactQuery, TypedFlatConfigItem } from "../types";
import { ensurePackages, interopDefault } from "../utils/helpers";

/**
 * Config for TanStack Query ESLint plugin.
 *
 * @see https://tanstack.com/query/latest/docs/eslint/eslint-plugin-query
 */
export async function reactQuery(
  options: OptionsReactQuery = {}
): Promise<TypedFlatConfigItem[]> {
  const { strict = false, overrides = {} } = options;

  await ensurePackages(["@tanstack/eslint-plugin-query"]);

  const pluginQuery = await interopDefault(
    import("@tanstack/eslint-plugin-query")
  );

  const configKey = strict ? "flat/recommended-strict" : "flat/recommended";
  const [config] = pluginQuery.configs[configKey] as TypedFlatConfigItem[];

  return [
    {
      ...config,
      name: "storm/react-query/rules",
      rules: {
        ...(config?.rules ?? {}),
        ...overrides
      }
    }
  ];
}
