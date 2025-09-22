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
    format: ["esm"],
    outDir: "dist",
    clean: true,
    dts: true,
    sourcemap: false,
    tsconfig: "./tsconfig.json",
    shims: true,
    silent: true,
    bundle: true,
    noExternal: ["eslint-plugin-pnpm", "eslint-plugin-tsdoc", "zod"]
  }
]);
