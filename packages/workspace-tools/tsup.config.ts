import { defineConfig } from "tsup";

export default defineConfig([
  {
    name: "workspace-tools",
    target: "node22",
    entryPoints: [
      "./src/index.ts",
      "./src/types.ts",
      "./src/base/*.ts",
      "./src/utils/*.ts",
      "./src/executors/*/executor.ts",
      "./src/generators/init/init.ts",
      "./src/generators/*/generator.ts",
      "./src/plugins/rust/*.ts",
      "./src/plugins/typescript/*.ts"
    ],
    outDir: "dist",
    format: ["cjs", "esm"],
    platform: "node",
    splitting: true,
    clean: true,
    dts: {
      entry: "src/index.ts"
    },
    sourcemap: false,
    shims: true,
    tsconfig: "./tsconfig.lib.json"
  }
  // {
  //   name: "workspace-tools-nx",
  //   target: "node22",
  //   entryPoints: [
  //     "./src/executors/*/executor.ts",
  //     "./src/generators/init/init.ts",
  //     "./src/generators/*/generator.ts",
  //     "./src/plugins/rust/*.ts",
  //     "./src/plugins/typescript/*.ts"
  //   ],
  //   outDir: "dist/src",
  //   format: ["cjs"],
  //   platform: "node",
  //   splitting: true,
  //   clean: true,
  //   dts: true,
  //   sourcemap: false,
  //   shims: true,
  //   tsconfig: "./tsconfig.lib.json"
  // }
]);
