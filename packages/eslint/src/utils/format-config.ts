import type { Linter } from "eslint";

export const formatConfig = (
  name: string,
  config: Linter.Config[] = []
): Linter.Config[] => {
  return config.map((config, index) => {
    if (!config || config.name) {
      return config ?? {};
    }

    return {
      ...config,
      name: `Storm Software (${config.name ? config.name : name}) #${index + 1}`,
      settings: {
        "import/resolver": "node",
        ...(config.settings ?? {})
      }
    };
  });
};
