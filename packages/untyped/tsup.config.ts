import { defineConfig } from "tsup";

export default defineConfig([
  {
    name: "untyped-lib",
    target: "node22",
    tsconfig: "./tsconfig.json",
    entryPoints: ["./src/*.ts", "./src/generators/*.ts"],
    format: ["cjs", "esm"],
    outDir: "dist/src",
    platform: "node",
    splitting: true,
    clean: true,
    dts: true,
    sourcemap: false,
    shims: true,
    silent: true,
    skipNodeModulesBundle: true
  },
  {
    name: "untyped-bin",
    target: "node22",
    tsconfig: "./tsconfig.json",
    entryPoints: ["./bin/untyped.ts"],
    outDir: "dist/bin",
    format: ["cjs", "esm"],
    platform: "node",
    splitting: false,
    clean: true,
    dts: false,
    sourcemap: false,
    shims: true,
    silent: true,
    skipNodeModulesBundle: true
  }
]);
