import { defineConfig } from "tsup";

export default defineConfig([
  {
    name: "git-tools-changelog-renderer",
    target: "node22",
    entryPoints: ["src/release/changelog-renderer.ts"],
    format: ["cjs", "esm"],
    outDir: "dist/changelog-renderer",
    platform: "node",
    treeshake: true,
    splitting: false,
    bundle: true,
    shims: true,
    clean: false,
    dts: false,
    sourcemap: true,
    silent: true,
    tsconfig: "./tsconfig.json",
    external: ["nx", "@nx/*"],
    noExternal: ["zod", "zod/mini"]
  }
]);
