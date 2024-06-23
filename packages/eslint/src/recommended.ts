import type { Linter } from "eslint";
import base from "./base";
import nx from "./nx";
import { CODE_BLOCK, CODE_FILE, TS_FILE } from "./utils/constants";
import { formatConfig } from "./utils/format-config";
import { ignores } from "./utils/ignores";

const config: Linter.FlatConfig[] = [
  ...base,
  ...nx,
  {
    files: [CODE_FILE],
    ignores: [
      ...ignores,
      "!.*", // Don't ignore dot-files because by default ESLint ignore dot-files (except for .eslintrc.*) and dot-folders
      ".git"
    ]
  },
  {
    // Rules which require type info and exclude virtual ts files extracted by `eslint-plugin-mdx`
    files: [TS_FILE],
    ignores: [...ignores, CODE_BLOCK],
    rules: {
      "@typescript-eslint/prefer-optional-chain": "error"
    }
  },
  {
    files: [TS_FILE],
    ignores,
    rules: {
      "@typescript-eslint/consistent-type-assertions": "error"
    }
  },
  {
    files: ["*.c{j,t}s"],
    ignores,
    rules: { "@typescript-eslint/no-var-requires": "off" }
  },
  {
    files: ["*.{spec,test}.*"],
    ignores,
    rules: { "import/extensions": ["error", "never"] }
  },
  {
    files: [
      "**/vite.config.ts",
      "**/jest.config.js",
      "**/*.d.ts",
      "**/website/theme.config.tsx",
      "**/tsup.config.ts",
      "**/postcss.config.ts",
      "**/tailwind.config.ts",
      "**/next-sitemap.config.js"
    ],
    ignores,
    rules: { "import/no-default-export": "off" }
  },
  {
    files: ["*.d.ts"],
    rules: {
      "no-var": "off"
    }
  }
];

export default formatConfig("Recommended", config);
