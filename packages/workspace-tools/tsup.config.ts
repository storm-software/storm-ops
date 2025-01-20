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
      "./src/base/base-executor.ts",
      "./src/base/base-executor.schema.ts",
      "./src/base/base-generator.ts",
      "./src/base/base-generator.schema.ts",
      "./src/base/cargo-base-executor.schema.ts",
      "./src/base/typescript-build-executor.schema.ts",
      "./src/base/typescript-library-generator.schema.ts",
      "./src/utils/base-executor.schema.ts",
      "./src/executors/*/executor.ts",
      "./src/generators/*/generator.ts",
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
