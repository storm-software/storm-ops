import { defineConfig } from "tsup";

export default defineConfig([
  {
    name: "pnpm-tools",
    target: "esnext",
    entryPoints: ["./src/*.ts", "./src/helpers/*.ts"],
    format: ["cjs", "esm"],
    outDir: "dist",
    platform: "node",
    splitting: true,
    treeshake: true,
    bundle: true,
    minify: true,
    clean: false,
    dts: true,
    sourcemap: false,
    tsconfig: "./tsconfig.json",
    shims: true,
    skipNodeModulesBundle: true
  }
  // {
  //   name: "pnpm-plugins",
  //   target: "esnext",
  //   entryPoints: ["./src/plugins/*.ts"],
  //   format: ["cjs"],
  //   outDir: "dist/plugins",
  //   platform: "node",
  //   splitting: false,
  //   treeshake: true,
  //   bundle: true,
  //   minify: false,
  //   clean: false,
  //   dts: true,
  //   tsconfig: "./tsconfig.json",
  //   shims: true
  // }
]);
