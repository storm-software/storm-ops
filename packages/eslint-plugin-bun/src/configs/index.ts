import type { Linter } from "eslint";
import recommended from "./recommended";

export const configs: Record<string, Linter.Config[]> = {
  recommended
};
