import base from "./base";
import electron from "./electron";
import graphql from "./graphql";
import json from "./json";
import markdown from "./markdown";
import next from "./next";
import nx from "./nx";
import react from "./react";
import reactNative from "./react-native";
import tsdoc from "./tsdoc";
import yml from "./yml";

export * from "./rules/import";
export * from "./rules/jsx-a11y";
export * from "./rules/react";
export * from "./rules/storm";
export * from "./rules/ts-docs";

export const configs = {
  base,
  nx,
  react,
  reactNative,
  electron,
  next,
  json,
  yml,
  tsdoc,
  markdown,
  graphql
};

export default configs;
