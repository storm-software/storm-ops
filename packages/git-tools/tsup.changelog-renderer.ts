import { defineConfig } from "tsup";

export default defineConfig([
  {
    name: "git-tools-changelog-renderer",
    target: "node22",
    entryPoints: ["src/release/changelog-renderer.ts"],
    format: ["cjs", "esm"],
    outDir: "dist/changelog-renderer",
    platform: "node",
    splitting: false,
    bundle: true,
    shims: true,
    clean: true,
    dts: false,
    sourcemap: false,
    tsconfig: "./tsconfig.json",
    external: ["nx", "@nx/*"]
  }
]);
