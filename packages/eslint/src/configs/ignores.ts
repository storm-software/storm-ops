import { GLOB_EXCLUDE } from "@storm-software/package-constants/globs";
import type { TypedFlatConfigItem } from "../types";

export async function ignores(
  userIgnores: string[] = []
): Promise<TypedFlatConfigItem[]> {
  return [
    {
      ignores: [...GLOB_EXCLUDE, ...userIgnores],
      name: "storm/ignores"
    }
  ];
}
