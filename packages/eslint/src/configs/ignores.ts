import defu from "defu";
import type { TypedFlatConfigItem } from "../types";
import { GLOB_EXCLUDE } from "../utils/constants";
import { DEFAULT_IGNORES } from "../utils/ignores";

export async function ignores(
  userIgnores: string[] = []
): Promise<TypedFlatConfigItem[]> {
  return [
    {
      ignores: defu(GLOB_EXCLUDE, DEFAULT_IGNORES, userIgnores),
      name: "storm/ignores"
    }
  ];
}
