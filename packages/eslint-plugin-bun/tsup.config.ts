import { defineConfig } from "tsup";

export default defineConfig([
  {
    name: "eslint-plugin-bun",
    platform: "node",
    entry: {
      index: "src/index.ts",
      plugin: "src/plugin.ts",
      "configs/index": "src/configs/index.ts",
      "configs/recommended": "src/configs/recommended.ts",
      "helpers/create-rule": "src/helpers/create-rule.ts",
      "helpers/bun-workspace": "src/helpers/bun-workspace.ts",
      "helpers/iterate-dependencies": "src/helpers/iterate-dependencies.ts",
      "rules/json-enforce-catalog": "src/rules/json-enforce-catalog.ts",
      "rules/json-valid-catalog": "src/rules/json-valid-catalog.ts",
      "rules/json-no-unused-catalog-item":
        "src/rules/json-no-unused-catalog-item.ts",
      "rules/json-no-duplicate-catalog-item":
        "src/rules/json-no-duplicate-catalog-item.ts"
    },
    format: ["esm"],
    outDir: "dist",
    clean: true,
    dts: true,
    treeshake: true,
    sourcemap: false,
    tsconfig: "./tsconfig.json",
    splitting: false,
    shims: true,
    silent: false,
    bundle: true,
    skipNodeModulesBundle: true,
    outExtension() {
      return {
        js: ".mjs"
      };
    }
  }
]);
