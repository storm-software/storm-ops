import { defineConfig } from "tsup";

export default defineConfig([
  {
    name: "testing-tools",
    target: "node22",
    entryPoints: ["./src/*.ts", "./src/jest/*.ts", "./src/jest/config/*.ts"],
    format: ["cjs", "esm"],
    outDir: "dist/src",
    platform: "node",
    splitting: false,
    clean: true,
    dts: true,
    sourcemap: false,
    tsconfig: "./tsconfig.json",
    shims: true,
    skipNodeModulesBundle: true
  }
]);
