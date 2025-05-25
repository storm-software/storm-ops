import { defineConfig } from "tsup";

export default defineConfig([
  {
    name: "tsdoc",
    entryPoints: ["src/index.ts"],
    format: ["cjs", "esm"],
    outDir: "dist",
    clean: true,
    dts: true,
    sourcemap: false,
    tsconfig: "./tsconfig.json",
    shims: true,
    bundle: true
  }
]);
