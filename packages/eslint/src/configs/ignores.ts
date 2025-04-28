import defu from "defu";
import { DEFAULT_IGNORES } from "src/utils/ignores";
import type { TypedFlatConfigItem } from "../types";
import { GLOB_EXCLUDE } from "../utils/constants";

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
