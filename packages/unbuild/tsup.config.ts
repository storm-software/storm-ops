import { defineConfig } from "tsup";

export default defineConfig([
  {
    name: "unbuild-base",
    target: "node22",
    entryPoints: ["./src/*.ts", "./src/plugins/*.ts"],
    outDir: "dist/src",
    format: ["cjs", "esm"],
    platform: "node",
    splitting: true,
    clean: true,
    dts: true,
    sourcemap: false,
    tsconfig: "./tsconfig.json",
    external: ["unbuild", "nx", "@nx/*"]
  },
  {
    name: "unbuild-bin",
    target: "node22",
    entryPoints: ["./bin/unbuild.ts"],
    outDir: "dist/bin",
    format: ["cjs"],
    platform: "node",
    splitting: false,
    clean: true,
    dts: false,
    sourcemap: false,
    tsconfig: "./tsconfig.json",
    external: ["unbuild", "nx", "@nx/*"]
  }
]);
