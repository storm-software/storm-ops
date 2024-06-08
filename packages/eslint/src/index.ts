import base from "./base";
import graphql from "./graphql";
import json from "./json";
import markdown from "./markdown";
import next from "./next";
import nx from "./nx";
import react from "./react";
import recommended from "./recommended";
import yml from "./yml";

export * from "./constants";
export * from "./rules/import";
export * from "./rules/jsx-a11y";
export * from "./rules/react";
export * from "./rules/storm";
export * from "./rules/ts-docs";
export * from "./rules/unicorn";
export * from "./ignores";

export const configs = {
  base,
  nx,
  react,
  next,
  json,
  yml,
  markdown,
  graphql,
  recommended
};

export default configs;
