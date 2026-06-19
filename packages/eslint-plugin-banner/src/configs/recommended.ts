import {
  GLOB_EXCLUDE,
  GLOB_SRC
} from "@storm-software/package-constants/globs";
import type { Linter } from "eslint";
import { plugin } from "../plugin";

const config: Linter.Config = {
  files: [GLOB_SRC],
  ignores: GLOB_EXCLUDE,
  name: "banner/recommended",
  plugins: {
    banner: plugin
  },
  rules: {
    "banner/banner": ["error", { commentStyle: "block", newlines: 2 }]
  }
};

export default config;
