import { defineConfig } from "tsup";

export default defineConfig([
  {
    name: "pnpm-plugin",
    target: "node16",
    entryPoints: ["./src/pnpmfile.ts"],
    format: ["cjs"],
    outDir: "dist",
    platform: "node",
    splitting: false,
    treeshake: true,
    bundle: true,
    minify: false,
    dts: false,
    sourcemap: false,
    tsconfig: "./tsconfig.json",
    cjsInterop: true,
    shims: true,
    silent: true,
    noExternal: ["defu", "@storm-software/package-constants"]
  }
]);
