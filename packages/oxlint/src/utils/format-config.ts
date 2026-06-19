import type { TypedConfigItem } from "../types";

export function formatConfig(
  name: string,
  config: TypedConfigItem[] = []
): TypedConfigItem[] {
  return config.map((item, index) => {
    if (!item) {
      return {};
    }

    if (item.name) {
      return item;
    }

    return {
      ...item,
      name: `storm/${name}#${index + 1}`
    };
  });
}
