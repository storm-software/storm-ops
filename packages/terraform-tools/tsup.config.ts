import { defineConfig } from "tsup";

export default defineConfig([
  {
    name: "terraform-tools",
    target: "node22",
    entryPoints: [
      "./*.ts",
      "./src/base/index.ts",
      "./src/base/terraform-executor.ts",
      "./src/base/*.untyped.ts",
      "./src/executors/*/executor.ts",
      "./src/executors/*/untyped.ts",
      "./src/generators/*/generator.ts",
      "./src/generators/*/untyped.ts",
      "./src/generators/init/init.ts"
    ],
    outDir: "dist",
    format: ["cjs", "esm"],
    platform: "node",
    splitting: true,
    clean: true,
    dts: true,
    sourcemap: false,
    shims: true,
    tsconfig: "./tsconfig.json",
    external: ["@storm-software/workspace-tools"]
  }
]);
