import { defineConfig } from "tsup";

export default defineConfig([
  {
    name: "linting-tools-base",
    target: "node22",
    entryPoints: ["src/index.ts"],
    format: ["cjs", "esm"],
    outDir: "dist/src",
    platform: "node",
    splitting: true,
    clean: false,
    dts: true,
    sourcemap: false,
    tsconfig: "./tsconfig.json",
    shims: true
  },
  {
    name: "linting-tools-bin",
    target: "node22",
    entryPoints: ["bin/*.ts"],
    format: ["cjs", "esm"],
    outDir: "dist/bin",
    platform: "node",
    splitting: false,
    bundle: true,
    clean: false,
    dts: false,
    sourcemap: false,
    tsconfig: "./tsconfig.json",
    shims: true,
    noExternal: ["cspell", "@manypkg/cli", "@manypkg/get-packages"]
  }
]);
