import type { ESLint, Linter } from "eslint";

type StormESLintPluginConfigs = Record<
  string,
  Linter.FlatConfig<Linter.RulesRecord>[]
>;

type StormESLintPluginMeta = ESLint.Plugin["meta"];

type StormESLintPlugin = Omit<ESLint.Plugin, "configs" | "meta"> & {
  meta: StormESLintPluginMeta;
  configs: StormESLintPluginConfigs;
};

declare const cjsExport: StormESLintPlugin;
export = cjsExport;
