import stormPlugin from "eslint-plugin-storm-software";
import electron from "@storm-software/eslint/electron";
import next from "@storm-software/eslint/next";
import react from "@storm-software/eslint/react";
import reactNative from "@storm-software/eslint/react-native";
import {
  StormESLintReactPluginConfigType,
  type StormESLintReactPluginConfigs
} from "./types";

const configs = {
  ...stormPlugin.configs,
  [StormESLintReactPluginConfigType.REACT]: react,
  [StormESLintReactPluginConfigType.REACT_NATIVE]: reactNative,
  [StormESLintReactPluginConfigType.NEXT]: next,
  [StormESLintReactPluginConfigType.ELECTRON]: electron
} as StormESLintReactPluginConfigs;

export default configs;
