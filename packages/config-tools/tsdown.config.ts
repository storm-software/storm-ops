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

const config = defineConfig([{
  name: "config-tools-base",
  target: "ESNext",
  entry: ["src/**/*.ts"],
  format: ["cjs", "esm"],
  outDir: "dist",
  platform: "node",
  exports: {
    all: true,
    inlinedDependencies: false
  },
  clean: true,
  dts: true,
  sourcemap: false,
  treeshake: true,
  unbundle: true,
  tsconfig: "./tsconfig.json",
  shims: true,
  deps: {
    neverBundle: true
  }
}, {
  name: "config-tools-bin",
  target: "node22",
  entry: ["bin/*.ts"],
  format: ["cjs", "esm"],
  outDir: "bin",
  platform: "node",
  exports: false,
  clean: false,
  dts: false,
  sourcemap: false,
  treeshake: true,
  unbundle: false,
  tsconfig: "./tsconfig.json",
  shims: true,
  deps: {
    neverBundle: true
  }
}]);

export default config;
