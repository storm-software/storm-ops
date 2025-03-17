import type { Plugin } from "rollup";
import { UnbuildResolvedOptions } from "../types";

export const swcPlugin = (options: UnbuildResolvedOptions): Plugin => {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const { transform } = require("@swc/core");
  return {
    name: "storm:swc",
    transform(code, filename) {
      return transform(code, {
        filename,
        jsc: {
          transform: {
            react: { runtime: "automatic" }
          }
        }
      });
    }
  };
};
