import { defineConfig } from "tsup";

export default defineConfig([
  {
    name: "unbuild-dist",
    target: "node22",
    entryPoints: ["./src/*.ts", "./src/plugins/*.ts"],
    format: ["cjs", "esm"],
    outDir: "dist/src",
    platform: "node",
    splitting: true,
    treeshake: true,
    clean: true,
    dts: true,
    sourcemap: false,
    tsconfig: "./tsconfig.json",
    external: ["unbuild", "nx", "@nx/*"]
  },
  {
    name: "unbuild-bin",
    target: "node22",
    entryPoints: ["bin/*.ts"],
    format: ["cjs", "esm"],
    outDir: "dist/bin",
    platform: "node",
    bundle: true,
    splitting: true,
    clean: true,
    dts: false,
    sourcemap: false,
    tsconfig: "./tsconfig.json",
    external: ["nx", "@nx/*"]
  }
]);
