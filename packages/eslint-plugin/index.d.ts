import type { ESLint, Linter } from "eslint";

export type StormESLintPluginConfigType =
  | "base"
  | "recommended"
  | "nx"
  | "json"
  | "yml"
  | "markdown";
export const StormESLintPluginConfigKeys = {
  BASE: "base" as StormESLintPluginConfigType,
  RECOMMENDED: "recommended" as StormESLintPluginConfigType,
  NX: "nx" as StormESLintPluginConfigType,
  JSON: "json" as StormESLintPluginConfigType,
  YML: "yml" as StormESLintPluginConfigType,
  MARKDOWN: "markdown" as StormESLintPluginConfigType
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

export type StormESLintGraphQLPluginConfigType = "graphql";
export const StormESLintGraphQLPluginConfigType = {
  GRAPHQL: "graphql" as StormESLintGraphQLPluginConfigType
};

export const StormESLintGraphQLPluginConfigKeys = {
  ...StormESLintPluginConfigKeys,
  [StormESLintGraphQLPluginConfigType.GRAPHQL]:
    "graphql" as StormESLintGraphQLPluginConfigType
};

export type StormESLintGraphQLPluginConfigs = StormESLintPluginConfigs<
  typeof StormESLintGraphQLPluginConfigKeys
>;

export type StormESLintGraphQLPlugin =
  StormESLintPlugin<StormESLintGraphQLPluginConfigs>;

export type StormESLintReactPluginConfigType =
  | "react"
  | "react-native"
  | "next"
  | "electron";
export const StormESLintReactPluginConfigType = {
  REACT: "react" as StormESLintReactPluginConfigType,
  REACT_NATIVE: "react-native" as StormESLintReactPluginConfigType,
  NEXT: "next" as StormESLintReactPluginConfigType,
  ELECTRON: "electron" as StormESLintReactPluginConfigType
};

export const StormESLintReactPluginConfigKeys = {
  ...StormESLintPluginConfigKeys,
  [StormESLintReactPluginConfigType.REACT]:
    "react" as StormESLintReactPluginConfigType,
  [StormESLintReactPluginConfigType.REACT_NATIVE]:
    "react-native" as StormESLintReactPluginConfigType,
  [StormESLintReactPluginConfigType.NEXT]:
    "next" as StormESLintReactPluginConfigType,
  [StormESLintReactPluginConfigType.ELECTRON]:
    "electron" as StormESLintReactPluginConfigType
};

export type StormESLintReactPluginConfigs = StormESLintPluginConfigs<
  typeof StormESLintReactPluginConfigKeys
>;

export type StormESLintReactPlugin =
  StormESLintPlugin<StormESLintReactPluginConfigs>;
