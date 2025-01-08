import { InputPluginOption } from "rollup";
import { analyzePlugin } from "./plugins/analyze-plugin";
import { onErrorPlugin } from "./plugins/on-error";
import { swcPlugin } from "./plugins/swc-plugin";
import { tscPlugin } from "./plugins/tsc-plugin";
import { typeDefinitions } from "./plugins/type-definitions";
import type { UnbuildOptions, UnbuildResolvedOptions } from "./types";

export const getDefaultBuildPlugins = async (
  options: UnbuildOptions,
  resolvedOptions: UnbuildResolvedOptions
): Promise<InputPluginOption[]> =>
  Promise.all(
    [
      analyzePlugin(options, resolvedOptions),
      swcPlugin(options, resolvedOptions),
      typeDefinitions(options, resolvedOptions),
      tscPlugin(options, resolvedOptions),
      onErrorPlugin(options, resolvedOptions)
    ].map(plugin => Promise.resolve(plugin))
  );
