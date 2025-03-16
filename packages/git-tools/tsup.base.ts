import { defineConfig } from "tsup";

export default defineConfig([
  {
    name: "git-tools-base",
    target: "node22",
    entryPoints: [
      "src/index.ts",
      "src/types.ts",
      "src/commit/config.ts",
      "src/commitlint/config.ts",
      "src/release/config.ts"
    ],
    format: ["cjs", "esm"],
    outDir: "dist/src",
    platform: "node",
    splitting: true,
    clean: false,
    dts: true,
    sourcemap: false,
    tsconfig: "./tsconfig.json",
    external: ["nx", "@nx/*"],
    skipNodeModulesBundle: true
  },
  {
    name: "git-tools-changelog-renderer",
    target: "node22",
    entryPoints: ["src/release/changelog-renderer.ts"],
    format: ["cjs", "esm"],
    outDir: "dist/src",
    platform: "node",
    bundle: true,
    shims: true,
    clean: false,
    dts: false,
    sourcemap: false,
    tsconfig: "./tsconfig.json",
    external: ["nx", "@nx/*"]
  }
]);
