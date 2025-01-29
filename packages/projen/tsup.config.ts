import { defineConfig } from "tsup";

export default defineConfig([
  {
    name: "projen",
    target: "node22",
    entryPoints: [
      "./*.ts",
      "./src/base/*.ts",
      "./src/executors/*/executor.ts",
      "./src/generators/*/generator.ts"
    ],
    outDir: "dist",
    format: ["cjs", "esm"],
    platform: "node",
    splitting: true,
    clean: true,
    dts: true,
    sourcemap: false,
    shims: true,
    tsconfig: "./tsconfig.json"
  }
]);
