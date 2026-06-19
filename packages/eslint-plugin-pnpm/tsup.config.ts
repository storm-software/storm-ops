import { defineConfig } from "tsup";

export default defineConfig([
  {
    name: "eslint",
    platform: "node",
    entryPoints: [
      "src/preset.ts",
      "src/types.ts",
      "src/rules/*.ts",
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
    skipNodeModulesBundle: true,
    noExternal: ["eslint-plugin-pnpm"]
  }
]);
