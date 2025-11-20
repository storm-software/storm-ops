import { defineConfig } from "tsup";

export default defineConfig([
  {
    name: "pnpm-plugin",
    target: "esnext",
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
    shims: true,
    silent: true,
    noExternal: ["@pnpm/plugin-esm-node-path", "defu"]
  }
]);
