import { defineConfig } from "tsup";

export default defineConfig([
  {
    name: "linting-tools-bin",
    target: "node22",
    entryPoints: ["bin/*.ts"],
    format: ["cjs", "esm"],
    outDir: "dist/bin",
    platform: "node",
    splitting: true,
    bundle: true,
    clean: false,
    dts: false,
    sourcemap: false,
    tsconfig: "./tsconfig.json",
    shims: true
  }
]);
