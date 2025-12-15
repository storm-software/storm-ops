import { defineConfig } from "tsup";

export default defineConfig([
  {
    name: "vite-base",
    target: "node22",
    entryPoints: ["./src/*.ts"],
    outDir: "dist/src",
    format: ["cjs", "esm"],
    platform: "node",
    splitting: true,
    clean: true,
    dts: true,
    sourcemap: false,
    silent: true,
    tsconfig: "./tsconfig.json",
    skipNodeModulesBundle: true
  }
]);
