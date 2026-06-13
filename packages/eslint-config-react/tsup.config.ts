import { defineConfig } from "tsup";

export default defineConfig([
  {
    name: "eslint-config-react",
    platform: "node",
    entryPoints: ["src/*.ts"],
    format: ["esm", "cjs"],
    outDir: "dist",
    clean: true,
    dts: true,
    treeshake: true,
    tsconfig: "./tsconfig.json",
    cjsInterop: true,
    shims: true,
    silent: true,
    bundle: false,
    skipNodeModulesBundle: true,
    external: ["@storm-software/eslint"]
  }
]);
