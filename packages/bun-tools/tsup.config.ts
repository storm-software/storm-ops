import { defineConfig } from "tsup";

export default defineConfig([
  {
    name: "bun-tools",
    target: "esnext",
    entryPoints: ["./src/*.ts", "./src/helpers/*.ts"],
    format: ["cjs", "esm"],
    outDir: "dist",
    platform: "node",
    splitting: true,
    treeshake: true,
    bundle: true,
    minify: true,
    clean: false,
    dts: true,
    sourcemap: false,
    tsconfig: "./tsconfig.json",
    shims: true,
    silent: true,
    skipNodeModulesBundle: true
  },
  {
    name: "bun-tools-bin",
    target: "esnext",
    entryPoints: ["bin/*.ts"],
    format: ["cjs", "esm"],
    outDir: "bin/dist",
    platform: "node",
    splitting: false,
    bundle: true,
    clean: false,
    dts: false,
    sourcemap: false,
    silent: true,
    tsconfig: "./tsconfig.json",
    skipNodeModulesBundle: true
  }
]);
