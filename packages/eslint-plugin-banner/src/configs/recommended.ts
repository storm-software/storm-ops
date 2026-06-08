import { GLOB_EXCLUDE, GLOB_SRC } from "@storm-software/package-constants";
import type { Linter } from "eslint";
import { plugin } from "../plugin";

const config: Linter.Config = {
  files: [GLOB_SRC],
  ignores: GLOB_EXCLUDE,
  name: "storm-banner/recommended",
  plugins: {
    "storm-banner": plugin
  },
  rules: {
    "storm-banner/banner": ["error", { commentType: "block", numNewlines: 2 }]
  }
};

export default config;
