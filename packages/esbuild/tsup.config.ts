import { defineConfig } from "tsup";

export default defineConfig([
  {
    name: "esbuild-base",
    target: "node22",
    entryPoints: ["./src/*.ts", "./src/plugins/*.ts"],
    format: ["cjs", "esm"],
    outDir: "dist/src",
    platform: "node",
    bundle: true,
    splitting: true,
    clean: true,
    dts: true,
    sourcemap: false,
    shims: true,
    silent: true,
    cjsInterop: true,
    requireToImport: true,
    tsconfig: "./packages/esbuild/tsconfig.json",
    external: ["nx", "@nx/*", "typescript"]
  },
  {
    name: "esbuild-bin",
    target: "node22",
    entryPoints: ["./bin/esbuild.ts"],
    outDir: "dist/bin",
    format: ["cjs"],
    platform: "node",
    bundle: true,
    splitting: false,
    clean: true,
    dts: false,
    sourcemap: false,
    silent: true,
    tsconfig: "./packages/esbuild/tsconfig.json",
    external: ["typescript"],
    skipNodeModulesBundle: false
  }
]);
