import type { ESLint } from "eslint";
import packageJson from "../package.json" with { type: "json" };
import banner from "./rules/banner";

export const plugin = {
  meta: {
    name: "storm-banner",
    version: packageJson.version
  },
  rules: {
    banner: banner
  }
} satisfies ESLint.Plugin;
