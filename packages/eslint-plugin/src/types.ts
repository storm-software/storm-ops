import type { ESLint, Linter } from "eslint";

export type StormESLintPluginConfigType =
  | "base"
  | "recommended"
  | "nx"
  | "json"
  | "yml"
  | "markdown";
export const StormESLintPluginConfigType = {
  BASE: "base" as StormESLintPluginConfigType,
  RECOMMENDED: "recommended" as StormESLintPluginConfigType,
  NX: "nx" as StormESLintPluginConfigType,
  JSON: "json" as StormESLintPluginConfigType,
  YML: "yml" as StormESLintPluginConfigType,
  MARKDOWN: "markdown" as StormESLintPluginConfigType
};

export const StormESLintPluginConfigKeys = {
  [StormESLintPluginConfigType.BASE]: "base" as StormESLintPluginConfigType,
  [StormESLintPluginConfigType.RECOMMENDED]:
    "recommended" as StormESLintPluginConfigType,
  [StormESLintPluginConfigType.NX]: "nx" as StormESLintPluginConfigType,
  [StormESLintPluginConfigType.JSON]: "json" as StormESLintPluginConfigType,
  [StormESLintPluginConfigType.YML]: "yml" as StormESLintPluginConfigType,
  [StormESLintPluginConfigType.MARKDOWN]:
    "markdown" as StormESLintPluginConfigType
};

export type StormESLintPluginConfigs<
  TStormESLintPluginConfigKeys extends
    typeof StormESLintPluginConfigKeys = typeof StormESLintPluginConfigKeys
> = Record<keyof TStormESLintPluginConfigKeys, Linter.FlatConfig[]>;

export type StormESLintPluginMeta = ESLint.Plugin["meta"];

export type StormESLintPlugin<
  TStormESLintPluginConfigs extends
    StormESLintPluginConfigs = StormESLintPluginConfigs
> = Omit<ESLint.Plugin, "configs" | "meta"> & {
  meta: StormESLintPluginMeta;
  configs: TStormESLintPluginConfigs;
};
