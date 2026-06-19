import type { Awaitable, TypedConfigItem } from "../types";

function isObject(value: unknown): value is Record<string, unknown> {
  return !!value && typeof value === "object" && !Array.isArray(value);
}

function deepMerge<T extends Record<string, unknown>>(target: T, source: T): T {
  const out = { ...target };

  for (const [key, value] of Object.entries(source)) {
    if (value == null) {
      continue;
    }

    const current = out[key as keyof T] as unknown;

    if (Array.isArray(value) && Array.isArray(current)) {
      (out as Record<string, unknown>)[key] = [...current, ...value];
      continue;
    }

    if (isObject(value) && isObject(current)) {
      (out as Record<string, unknown>)[key] = deepMerge(
        current as Record<string, unknown>,
        value as Record<string, unknown>
      );
      continue;
    }

    (out as Record<string, unknown>)[key] = value;
  }

  return out;
}

export async function combine(
  ...configs: Awaitable<TypedConfigItem | undefined | null | false>[]
): Promise<TypedConfigItem> {
  const resolved = await Promise.all(configs);

  return resolved.filter(Boolean).reduce<TypedConfigItem>((acc, current) => {
    return deepMerge(
      acc as Record<string, unknown>,
      current as Record<string, unknown>
    );
  }, {});
}
