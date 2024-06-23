import type { Linter } from "eslint";

export const formatConfig = (
  name: string,
  config: Linter.FlatConfig[] = []
): Linter.FlatConfig[] => {
  return config.map((config, index) => {
    if (!config || config.name) {
      return config ?? {};
    }

    return {
      ...config,
      name: `Storm Software (${name}) #${index + 1}`,
      settings: {
        "import/resolver": "node",
        ...(config.settings ?? {})
      }
    };
  });
};
