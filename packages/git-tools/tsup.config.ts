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
    clean: true,
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
    bundle: true,
    clean: true,
    dts: false,
    sourcemap: false,
    tsconfig: "./tsconfig.json",
    shims: true,
    skipNodeModulesBundle: false,
    noExternal: ["conventional-changelog-conventionalcommits"]
  }
]);
