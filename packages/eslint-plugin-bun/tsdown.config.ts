/* -------------------------------------------------------------------

                  ⚡ Storm Software - Shell Shock

 This code was released as part of the Shell Shock project. Shell Shock
 is maintained by Storm Software under the Apache-2.0 license, and is
 free for commercial and private use. For more information, please visit
 our licensing page at https://stormsoftware.com/licenses/projects/shell-shock.

 Website:                  https://stormsoftware.com
 Repository:               https://github.com/storm-software/shell-shock
 Documentation:            https://docs.stormsoftware.com/projects/shell-shock
 Contact:                  https://stormsoftware.com/contact

 SPDX-License-Identifier:  Apache-2.0

 ------------------------------------------------------------------- */

import { defineConfig } from "tsdown";

const config = defineConfig({
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
  platform: "node",
  target: "es2022",
  outDir: "dist",
  exports: true,
  shims: true,
  clean: true,
  dts: true,
  sourcemap: false,
  treeshake: true,
  deps: {
    neverBundle: true
  }
});

export default config;
