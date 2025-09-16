import { defineConfig } from "tsup";

export default defineConfig([
  {
    name: "config-tools-base",
    target: "ESNext",
    entryPoints: ["./src/**/*.ts"],
    format: ["cjs", "esm"],
    outDir: "dist",
    platform: "node",
    bundle: true,
    splitting: true,
    clean: false,
    dts: true,
    sourcemap: false,
    tsconfig: "./tsconfig.json",
    shims: true
  },
  {
    name: "config-tools-bin",
    target: "node20",
    entryPoints: ["bin/*.ts"],
    format: ["cjs", "esm"],
    outDir: "bin",
    platform: "node",
    splitting: false,
    bundle: true,
    clean: false,
    dts: false,
    sourcemap: false,
    tsconfig: "./tsconfig.json"
  }
]);
