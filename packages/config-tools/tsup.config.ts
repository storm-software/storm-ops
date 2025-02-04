import { defineConfig } from "tsup";

export default defineConfig([
  {
    name: "config-tools-base",
    target: "node22",
    entryPoints: ["./src/**/*.ts"],
    format: ["cjs", "esm"],
    outDir: "dist/src",
    platform: "node",
    bundle: true,
    splitting: true,
    clean: false,
    dts: true,
    sourcemap: false,
    tsconfig: "./tsconfig.json"
  },
  {
    name: "config-tools-bin",
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
    tsconfig: "./tsconfig.json"
  }
]);
