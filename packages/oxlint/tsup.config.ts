import { defineConfig } from "tsup";

export default defineConfig([
  {
    name: "oxlint",
    platform: "node",
    entryPoints: [
      "src/index.ts",
      "src/preset.ts",
      "src/types.ts",
      "src/configs/*.ts",
      "src/utils/*.ts"
    ],
    format: ["esm", "cjs"],
    outDir: "dist",
    clean: true,
    dts: true,
    treeshake: true,
    sourcemap: false,
    tsconfig: "./tsconfig.json",
    cjsInterop: true,
    shims: true,
    silent: true,
    bundle: true,
    skipNodeModulesBundle: true
  }
]);
