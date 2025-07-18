import { defineConfig } from "tsup";

export default defineConfig([
  {
    name: "pulumi-tools",
    target: "node22",
    entryPoints: [
      "./*.ts",
      "./src/base/*.ts",
      "./src/lib/aws/*.ts",
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
    tsconfig: "./tsconfig.json",
    external: ["@storm-software/workspace-tools"]
  }
]);
