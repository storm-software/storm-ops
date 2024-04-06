import type { Plugin } from "rollup";

export function swc(): Plugin {
  const { transform } = require("@swc/core");
  return {
    name: "storm-swc",
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
