import {
  GLOB_EXCLUDE,
  GLOB_TS,
  GLOB_TSX
} from "@storm-software/package-constants/globs";
import type { Linter } from "eslint";
import { plugin } from "../plugin";

const config: Linter.Config = {
  files: [GLOB_TS, GLOB_TSX],
  ignores: GLOB_EXCLUDE,
  name: "tsdoc/recommended",
  plugins: {
    tsdoc: plugin
  },
  rules: {
    "tsdoc/syntax": ["error", { type: "recommended" }]
  }
};

export default config;
