import { defineConfig } from "tsup";

export default defineConfig([
  {
    name: "linting-tools-base",
    target: "node22",
    entryPoints: ["src/index.ts"],
    format: ["cjs", "esm"],
    outDir: "dist/src",
    platform: "node",
    splitting: true,
    clean: false,
    dts: true,
    sourcemap: false,
    tsconfig: "./tsconfig.json",
    shims: true
  }
]);
