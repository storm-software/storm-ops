import { defineConfig } from "tsup";

export default defineConfig([
  {
    name: "eslint",
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
    shims: true,
    silent: true,
    bundle: true,
    skipNodeModulesBundle: true,
    noExternal: ["eslint-plugin-pnpm", "eslint-plugin-tsdoc", "zod", "date-fns"]
  }
]);
