import { defineConfig } from "tsup";

export default defineConfig([
  {
    name: "workspace-tools",
    target: "node22",
    entryPoints: [
      "./*.ts",
      "./src/base/*.ts",
      "./src/utils/*.ts",
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
