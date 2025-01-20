import { InputPluginOption } from "rollup";
import { analyzePlugin } from "./plugins/analyze";
import { onErrorPlugin } from "./plugins/on-error";
import { tscPlugin } from "./plugins/tsc";
import { typeDefinitions } from "./plugins/type-definitions";
import type { UnbuildOptions, UnbuildResolvedOptions } from "./types";

export const getDefaultBuildPlugins = async (
  options: UnbuildOptions,
  resolvedOptions: UnbuildResolvedOptions
): Promise<InputPluginOption[]> =>
  Promise.all(
    [
      analyzePlugin(options, resolvedOptions),
      typeDefinitions(resolvedOptions.projectRoot),
      tscPlugin(options, resolvedOptions),
      onErrorPlugin(options, resolvedOptions)
    ].map(plugin => Promise.resolve(plugin))
  );
