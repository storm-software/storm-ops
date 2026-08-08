import { defineConfig } from "tsup";

export default defineConfig([
  {
    name: "linting-tools",
    target: "node22",
    entryPoints: ["bin/*.ts"],
    format: ["cjs", "esm"],
    outDir: "dist",
    platform: "node",
    splitting: true,
    bundle: false,
    clean: false,
    dts: false,
    sourcemap: false,
    tsconfig: "./tsconfig.json",
    shims: true,
    silent: true,
    skipNodeModulesBundle: true,
    noExternal: ["actions-up", "@manypkg/cli"]
  }
]);
