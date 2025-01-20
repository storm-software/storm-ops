import { defineConfig } from "tsup";

export default defineConfig([
  {
    name: "workspace-tools",
    target: "node22",
    entryPoints: [
      "./index.ts",
      "./executors.ts",
      "./generators.ts",
      "./src/types.ts",
      "./src/base/index.ts",
      "./src/base/base-executor.ts",
      "./src/base/base-generator.ts",
      "./src/base/*.untyped.ts",
      "./src/utils/*.ts",
      "./src/executors/*/executor.ts",
      "./src/executors/*/untyped.ts",
      "./src/generators/*/generator.ts",
      "./src/generators/*/untyped.ts",
      "./src/generators/init/init.ts",
      "./src/plugins/rust/*.ts",
      "./src/plugins/typescript/*.ts"
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
