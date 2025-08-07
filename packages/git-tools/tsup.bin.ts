import { defineConfig } from "tsup";

export default defineConfig([
  {
    name: "git-tools-bin",
    target: "node22",
    entryPoints: ["bin/*.ts"],
    format: ["cjs", "esm"],
    outDir: "dist/bin",
    platform: "node",
    treeshake: true,
    splitting: true,
    bundle: true,
    clean: false,
    dts: false,
    sourcemap: false,
    tsconfig: "./tsconfig.json",
    shims: true,
    external: [
      "oxc-parser",
      "@oxc-parser/*",
      "nx",
      "@nx/*",
      "@storm-software/*"
    ],
    noExternal: ["conventional-commits-parser", "defu", "zod"],
    skipNodeModulesBundle: true
  }
]);
