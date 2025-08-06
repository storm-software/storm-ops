import { defineConfig } from "tsup";

export default defineConfig([
  {
    name: "config",
    target: "esnext",
    entryPoints: ["./src/*.ts"],
    format: ["cjs", "esm"],
    outDir: "dist",
    platform: "neutral",
    splitting: true,
    treeshake: true,
    bundle: true,
    minify: true,
    clean: false,
    dts: true,
    sourcemap: false,
    tsconfig: "./tsconfig.json",
    shims: true
  }
]);
