import { transform } from "@swc/core";
import type { Plugin } from "rollup";

export function swc(): Plugin {
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
}
