import { Renderer } from "../types";

/**
 * Causes esbuild to exit immediately with an error code.
 */
export const shebangRenderer: Renderer = {
  name: "shebang",

  renderChunk(_, __, info) {
    if (
      info.type === "chunk" &&
      /\.(cjs|js|mjs)$/.test(info.path) &&
      info.code.startsWith("#!")
    ) {
      info.mode = 0o755;
    }
  }
};
