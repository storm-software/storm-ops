import { defineConfig } from "tsup";

export default defineConfig([
  {
    name: "git-tools-bin",
    target: "node22",
    entryPoints: ["bin/*/index.ts"],
    format: ["cjs"],
    outDir: "dist/bin",
    platform: "node",
    splitting: false,
    bundle: true,
    clean: false,
    dts: false,
    sourcemap: false,
    tsconfig: "./tsconfig.json",
    shims: true,
    skipNodeModulesBundle: false,
    external: ["oxc-parser", "@oxc-parser/*"],
    noExternal: ["@commitlint/rules", "conventional-commits-parser", "defu"]
  }
]);
