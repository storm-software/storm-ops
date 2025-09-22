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
    bundle: true,
    clean: false,
    dts: false,
    sourcemap: false,
    tsconfig: "./tsconfig.json",
    shims: true,
    silent: true
  }
]);
