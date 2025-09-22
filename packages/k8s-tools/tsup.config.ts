import { defineConfig, Options } from "tsup";

export default defineConfig([
  {
    name: "k8s-tools",
    target: "node22",
    entryPoints: [
      "./*.ts",
      "./src/types.ts",
      "./src/utils/*.ts",
      "./src/executors/*/executor.ts",
      "./src/generators/*/generator.ts",
      "./src/plugins/docker/index.ts"
    ],
    outDir: "dist",
    format: ["cjs", "esm"],
    platform: "node",
    splitting: true,
    clean: true,
    dts: true,
    sourcemap: false,
    shims: true,
    silent: true,
    tsconfig: "./tsconfig.json",
    external: ["@storm-software/workspace-tools"]
  }
]) as Options[];
