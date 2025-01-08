import { defineConfig } from "tsup";

export default defineConfig([
  {
    name: "esbuild-base",
    target: "node22",
    entryPoints: ["./src/*.ts", "./src/plugins/*.ts"],
    format: ["cjs", "esm"],
    platform: "node",
    splitting: true,
    clean: true,
    dts: true,
    sourcemap: false,
    tsconfig: "./tsconfig.json",
    external: ["esbuild", "nx", "@nx/*"],
    skipNodeModulesBundle: true
  },
  {
    name: "esbuild-bin",
    target: "node22",
    entryPoints: ["./bin/esbuild.ts"],
    format: ["cjs"],
    platform: "node",
    bundle: true,
    splitting: false,
    clean: true,
    dts: false,
    sourcemap: false,
    tsconfig: "./tsconfig.json",
    skipNodeModulesBundle: false
  }
]);
