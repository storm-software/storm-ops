import { defineConfig } from "tsup";

export default defineConfig([
  {
    name: "tsup",
    entryPoints: ["src/index.ts"],
    format: ["cjs", "esm"],
    outDir: "dist",
    clean: true,
    dts: true,
    sourcemap: false,
    tsconfig: "./tsconfig.json",
    shims: true,
    silent: true,
    bundle: true,
    noExternal: ["tsup"]
  }
]);
