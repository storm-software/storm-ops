import {
  StormESLintPlugin,
  StormESLintPluginConfigKeys,
  StormESLintPluginConfigs
} from "eslint-plugin-storm-software/types";

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
  typeof StormESLintGraphQLPluginConfigKeys & typeof StormESLintPluginConfigKeys
>;

export type StormESLintGraphQLPlugin =
  StormESLintPlugin<StormESLintGraphQLPluginConfigs>;
