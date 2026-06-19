import { defineConfig, Options } from "tsup";

const config = defineConfig([
  {
    name: "cloudflare-tools",
    target: "node22",
    entryPoints: [
      "./index.ts",
      "./executors.ts",
      "./generators.ts",
      "./src/utils/*.ts",
      "./src/executors/*/executor.ts",
      "./src/executors/*/untyped.ts",
      "./src/generators/*/generator.ts",
      "./src/generators/*/untyped.ts",
      "./src/plugins/*.ts"
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
]) as Options;

export default config;
