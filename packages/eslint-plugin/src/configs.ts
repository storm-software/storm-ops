import base from "@storm-software/eslint/base";
import graphql from "@storm-software/eslint/graphql";
import json from "@storm-software/eslint/json";
import markdown from "@storm-software/eslint/markdown";
import next from "@storm-software/eslint/next";
import nx from "@storm-software/eslint/nx";
import react from "@storm-software/eslint/react";
import recommended from "@storm-software/eslint/recommended";
import yml from "@storm-software/eslint/yml";
import {
  StormESLintPluginConfigType,
  type StormESLintPluginConfigs
} from "./types";

const configs = {
  [StormESLintPluginConfigType.BASE]: base,
  [StormESLintPluginConfigType.RECOMMENDED]: recommended,
  [StormESLintPluginConfigType.NX]: nx,
  [StormESLintPluginConfigType.JSON]: json,
  [StormESLintPluginConfigType.YML]: yml,
  [StormESLintPluginConfigType.MARKDOWN]: markdown,
  [StormESLintPluginConfigType.REACT]: react,
  [StormESLintPluginConfigType.NEXT]: next,
  [StormESLintPluginConfigType.GRAPHQL]: graphql
} as StormESLintPluginConfigs;

export default configs;
