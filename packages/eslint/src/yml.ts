import type { Linter } from "eslint";
import ymlPlugin from "eslint-plugin-yml";
import base from "./base";
import { formatConfig } from "./utils/format-config";

// import { CODE_BLOCK } from "./constants";
// import { ignores } from "./ignores";

const config: Linter.FlatConfig[] = [
  ...base,
  ...ymlPlugin.configs["flat/base"],
  ...ymlPlugin.configs["flat/recommended"],
  ...ymlPlugin.configs["flat/prettier"],
  // {
  //   files: ["**/*.y{,a}ml"],
  //   plugins: {
  //     "yml": ymlPlugin as ESLint.Plugin
  //   },
  //   ignores: [
  //     ...ignores,
  //     CODE_BLOCK,
  //     "**/pnpm-lock.yaml",
  //     ".github/FUNDING.yml"
  //   ]
  // }
];

export default formatConfig("YAML", config);
