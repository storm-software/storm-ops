import { defineConfig } from "tsup";

export default defineConfig([
  {
    name: "git-tools-base",
    target: "node22",
    entryPoints: [
      "src/index.ts",
      "src/types.ts",
      "src/commit/config.ts",
      "src/release/changelog-renderer.ts"
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
    name: "git-tools-bin",
    target: "node22",
    entryPoints: ["bin/*/index.ts"],
    format: ["cjs", "esm"],
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
    noExternal: ["conventional-changelog-conventionalcommits"]
  }
]);
