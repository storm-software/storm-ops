import { defineConfig } from "tsup";

export default defineConfig([
  {
    name: "unbuild-base",
    target: "node22",
    entryPoints: ["./src/*.ts", "./src/plugins/*.ts"],
    format: ["cjs", "esm"],
    platform: "node",
    splitting: true,
    clean: true,
    dts: true,
    sourcemap: false,
    tsconfig: "./tsconfig.json",
    external: ["unbuild", "nx", "@nx/*"],
    skipNodeModulesBundle: true
  },
  {
    name: "unbuild-bin",
    target: "node22",
    entryPoints: ["./bin/unbuild.ts"],
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
