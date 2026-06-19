import { Plugin } from "@eslint/core";
import base from "eslint-plugin-pnpm";
import packageJson from "../package.json" with { type: "json" };

export const plugin = {
  ...base,
  meta: {
    name: "pnpm",
    version: packageJson.version
  }
} as Plugin;
