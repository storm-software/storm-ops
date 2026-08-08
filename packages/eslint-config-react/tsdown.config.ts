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
  name: "eslint-config-react",
  entry: ["src/index.ts"],
  format: ["esm", "cjs"],
  platform: "node",
  target: "es2022",
  outDir: "dist",
  exports: {
    all: true,
    inlinedDependencies: false
  },
  shims: true,
  clean: true,
  dts: true,
  unbundle: false,
  sourcemap: false,
  treeshake: true,
  deps: {
    neverBundle: true
  }
});

export default config;
