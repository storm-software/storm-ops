import { FlatCompat } from "@eslint/eslintrc";
import js from "@eslint/js";
import nx from "@nx/eslint-plugin";
import jsoncEslintParser from "jsonc-eslint-parser";
import { dirname } from "path";
import { fileURLToPath } from "url";

const compat = new FlatCompat({
  baseDirectory: dirname(fileURLToPath(import.meta.url)),
  recommendedConfig: js.configs.recommended
});

export default [
  ...nx.configs["flat/base"],
  {
    files: ["**/*.json"],
    // Override or add rules here
    rules: {},
    languageOptions: {
      parser: jsoncEslintParser
    }
  },
  ...nx.configs["flat/typescript"],
  ...nx.configs["flat/javascript"],
  ...compat
    .config({
      env: {
        jest: true
      }
    })
    .map(config => ({
      ...config,
      files: ["**/*.spec.ts", "**/*.spec.tsx", "**/*.spec.js", "**/*.spec.jsx"],
      rules: {
        ...config.rules
      }
    })),
  {
    ignores: ["**/dist", "**/node_modules", "**/.nx", "**/tmp"]
  },
  {
    ignores: [
      "**/package.json/**",
      "**/.wrangler/**",
      "**/tamagui.css",
      "**/workbox*.js",
      "**/sw*.js",
      "**/service-worker.js",
      "**/fallback*.js",
      "**/node_modules/**",
      "**/dist/**",
      "**/ios/**",
      "**/.git/**",
      "**/.android/**",
      "**/.DS_Store/**",
      "**/Thumbs.db/**",
      "**/.tamagui*",
      ".next/**",
      "CODEOWNERS",
      "dist/**",
      "coverage/**",
      ".nx/cache/**",
      "**/src/generators/**/files/**/*",
      "packages/eslint/**",
      "packages/eslint-plugin/**",
      "packages/tsup/workers/*.cjs"
    ]
  }
];
