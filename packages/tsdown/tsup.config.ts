import { defineConfig } from "tsup";

export default defineConfig([
  {
    name: "tsdown-base",
    target: "node22",
    entryPoints: ["./src/*.ts"],
    format: ["cjs", "esm"],
    platform: "node",
    splitting: true,
    clean: true,
    dts: true,
    sourcemap: false,
    tsconfig: "./tsconfig.json",
    external: ["tsdown", "nx", "@nx/*"],
    skipNodeModulesBundle: true
  },
  {
    name: "tsdown-bin",
    target: "node22",
    entryPoints: ["./bin/tsdown.ts"],
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
