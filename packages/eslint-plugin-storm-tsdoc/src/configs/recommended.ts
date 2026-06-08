import {
  GLOB_EXCLUDE,
  GLOB_TS,
  GLOB_TSX
} from "@storm-software/package-constants";
import type { Linter } from "eslint";
import { plugin } from "../plugin";

const config: Linter.Config = {
  files: [GLOB_TS, GLOB_TSX],
  ignores: GLOB_EXCLUDE,
  name: "storm-tsdoc/recommended",
  plugins: {
    "storm-tsdoc": plugin
  },
  rules: {
    "storm-tsdoc/syntax": ["error", { type: "recommended" }]
  }
};

export default config;
