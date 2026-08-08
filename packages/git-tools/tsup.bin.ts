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
    clean: false,
    dts: false,
    sourcemap: true,
    tsconfig: "./tsconfig.json",
    shims: true,
    silent: true,
    skipNodeModulesBundle: true,
    noExternal: ["conventional-commits-parser"]
  }
]);
