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
    tsconfig: "./tsconfig.json"
  },
  {
    name: "untyped-bin",
    target: "node22",
    entryPoints: ["./bin/untyped.ts"],
    format: ["cjs", "esm"],
    outDir: "dist/bin",
    platform: "node",
    bundle: true,
    clean: true,
    dts: true,
    sourcemap: false,
    tsconfig: "./tsconfig.json"
  }
]);
