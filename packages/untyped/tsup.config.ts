import { defineConfig } from "tsup";

export default defineConfig([
  {
    name: "untyped-lib",
    target: "node22",
    entryPoints: ["./src/*.ts", "./src/generators/*.ts"],
    format: ["cjs", "esm"],
    outDir: "dist/src",
    platform: "node",
    splitting: true,
    clean: true,
    dts: true,
    sourcemap: false,
    tsconfig: "./tsconfig.json",
    shims: true
  },
  {
    name: "untyped-bin",
    target: "node22",
    entryPoints: ["./bin/untyped.ts"],
    outDir: "dist/bin",
    format: ["cjs", "esm"],
    platform: "node",
    bundle: true,
    splitting: false,
    clean: true,
    dts: false,
    sourcemap: false,
    shims: true,
    tsconfig: "./tsconfig.json"
  }
]);
