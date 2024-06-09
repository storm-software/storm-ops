import type { ESLint, Linter } from "eslint";

export type StormESLintPluginConfigType =
  | "base"
  | "recommended"
  | "nx"
  | "json"
  | "yml"
  | "markdown"
  | "react"
  | "next"
  | "graphql";
export const StormESLintPluginConfigType = {
  BASE: "base" as StormESLintPluginConfigType,
  RECOMMENDED: "recommended" as StormESLintPluginConfigType,
  NX: "nx" as StormESLintPluginConfigType,
  JSON: "json" as StormESLintPluginConfigType,
  YML: "yml" as StormESLintPluginConfigType,
  MARKDOWN: "markdown" as StormESLintPluginConfigType,
  REACT: "react" as StormESLintPluginConfigType,
  NEXT: "next" as StormESLintPluginConfigType,
  GRAPHQL: "graphql" as StormESLintPluginConfigType
};

export type StormESLintPluginConfigs = Record<
  StormESLintPluginConfigType,
  Linter.FlatConfig[]
>;

export type StormESLintPluginMeta = ESLint.Plugin["meta"];

export type StormESLintPlugin = Omit<ESLint.Plugin, "configs" | "meta"> & {
  meta: StormESLintPluginMeta;
  configs: StormESLintPluginConfigs;
};
