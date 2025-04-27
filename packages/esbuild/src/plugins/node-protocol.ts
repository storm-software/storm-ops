import type * as esbuild from "esbuild";
import { ESBuildOptions } from "../types";

/**
 * The node: protocol was added to require in Node v14.18.0
 * https://nodejs.org/api/esm.html#node-imports
 */
export const nodeProtocolPlugin = (
  options: ESBuildOptions,
  resolvedOptions: ESBuildOptions
): esbuild.Plugin => {
  const nodeProtocol = "node:";

  return {
    name: "node-protocol-plugin",
    setup({ onResolve }) {
      onResolve(
        {
          filter: /^node:/
        },
        ({ path }) => ({
          path: path.slice(nodeProtocol.length),
          external: true
        })
      );
    }
  };
};
