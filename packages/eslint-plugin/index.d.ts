import type { ESLint, Linter } from "eslint";

type StormESLintPluginConfigType =
  | "base"
  | "recommended"
  | "nx"
  | "json"
  | "yml"
  | "markdown";

type StormESLintPluginConfigs = Record<
  StormESLintPluginConfigType,
  Linter.FlatConfig[]
>;

type StormESLintPluginMeta = ESLint.Plugin["meta"];

type StormESLintPlugin<
  TStormESLintPluginConfigs extends
    StormESLintPluginConfigs = StormESLintPluginConfigs
> = Omit<ESLint.Plugin, "configs" | "meta"> & {
  meta: StormESLintPluginMeta;
  configs: TStormESLintPluginConfigs;
};

export default StormESLintPlugin;
