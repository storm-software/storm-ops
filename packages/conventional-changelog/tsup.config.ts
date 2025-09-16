import { defineConfig } from "tsup";

export default defineConfig([
  {
    name: "conventional-changelog",
    entryPoints: ["src/*.ts", "src/types/*.ts", "src/utilities/*.ts"],
    format: ["cjs", "esm"],
    outDir: "dist",
    platform: "node",
    target: "node22",
    splitting: true,
    treeshake: true,
    clean: false,
    dts: true,
    sourcemap: false,
    tsconfig: "./tsconfig.json",
    shims: true,
    bundle: true,
    skipNodeModulesBundle: true
  }
]);
