import { defineConfig } from "tsup";

export default defineConfig([
  {
    name: "npm-tools",
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
    silent: true
  }
]);
