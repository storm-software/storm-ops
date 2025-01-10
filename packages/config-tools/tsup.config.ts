import { defineConfig } from "tsup";

export default defineConfig({
  name: "config-tools",
  target: "node22",
  entryPoints: ["./src/**/*.ts"],
  format: ["cjs", "esm"],
  platform: "node",
  splitting: true,
  bundle: true,
  clean: true,
  dts: true,
  sourcemap: false,
  tsconfig: "./tsconfig.json",
  shims: true,
  noExternal: ["chalk", "defu", "c12"],
  skipNodeModulesBundle: true
});
