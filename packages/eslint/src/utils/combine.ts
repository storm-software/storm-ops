import { Awaitable } from "eslint-flat-config-utils";
import { TypedFlatConfigItem } from "../types";

/**
 * Combine array and non-array configs into a single array.
 */
export async function combine(
  ...configs: Awaitable<TypedFlatConfigItem | TypedFlatConfigItem[]>[]
): Promise<TypedFlatConfigItem[]> {
  const resolved = await Promise.all(configs);
  return resolved.flat();
}
