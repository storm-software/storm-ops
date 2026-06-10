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
  entry: ["src/*.ts"],
  format: ["cjs", "esm"],
  platform: "node",
  target: "es2022",
  outDir: "dist",
  exports: false,
  shims: true,
  clean: true,
  dts: true,
  sourcemap: false,
  fixedExtension: true,
  treeshake: true,
  deps: {
    skipNodeModulesBundle: false
  }
});

export default config;
