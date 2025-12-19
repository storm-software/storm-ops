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
    skipNodeModulesBundle: true,
    external: ["@storm-software/config-tools", "chalk"],
    noExternal: ["untyped"]
  },
  {
    name: "untyped-bin",
    target: "node22",
    tsconfig: "./tsconfig.json",
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
    silent: true
  }
]);
