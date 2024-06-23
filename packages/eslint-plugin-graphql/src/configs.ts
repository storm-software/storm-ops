import stormPlugin from "eslint-plugin-storm-software";
import graphql from "@storm-software/eslint/graphql";
import {
  StormESLintGraphQLPluginConfigs,
  StormESLintGraphQLPluginConfigType
} from "./types";

const configs = {
  ...stormPlugin.configs,
  [StormESLintGraphQLPluginConfigType.GRAPHQL]: graphql
} as StormESLintGraphQLPluginConfigs;

export default configs;
