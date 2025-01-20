import { defineConfig } from "tsup";

export default defineConfig([
  {
    name: "unbuild-base",
    target: "node22",
    entryPoints: ["./src/*.ts", "./src/plugins/*.ts"],
    outDir: "dist/src",
    format: ["cjs", "esm"],
    platform: "node",
    bundle: true,
    splitting: true,
    clean: true,
    dts: true,
    sourcemap: false,
    shims: true,
    tsconfig: "./tsconfig.json",
    noExternal: ["unbuild", "rollup-plugin-typescript2"]
  },
  {
    name: "unbuild-bin",
    target: "node22",
    entryPoints: ["./bin/unbuild.ts"],
    outDir: "dist/bin",
    format: ["cjs", "esm"],
    platform: "node",
    bundle: true,
    splitting: false,
    clean: true,
    dts: false,
    sourcemap: false,
    shims: true,
    tsconfig: "./tsconfig.json",
    noExternal: ["unbuild", "rollup-plugin-typescript2"]
  }
]);
