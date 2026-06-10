import type { ESLint } from "eslint";
import base from "eslint-plugin-tsdoc";
import packageJson from "../package.json" with { type: "json" };

export const plugin = {
  ...base,
  meta: {
    name: "tsdoc",
    version: packageJson.version
  }
} satisfies ESLint.Plugin;
