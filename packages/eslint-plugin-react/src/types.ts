import {
  StormESLintPlugin,
  StormESLintPluginConfigKeys,
  StormESLintPluginConfigs
} from "eslint-plugin-storm-software/types";

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
  typeof StormESLintReactPluginConfigKeys & typeof StormESLintPluginConfigKeys
>;

export type StormESLintReactPlugin =
  StormESLintPlugin<StormESLintReactPluginConfigs>;

