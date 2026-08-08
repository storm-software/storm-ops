import { defineConfig } from "tsup";

export default defineConfig([
  {
    name: "eslint",
    platform: "node",
    entryPoints: [
      "src/index.ts",
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
    bundle: false,
    skipNodeModulesBundle: true,
    noExternal: [
      "zod",
      "date-fns",
      "minimatch",
      "eslint-plugin-import-x",
      "eslint-plugin-import-zod",
      "eslint-plugin-react-native",
      "eslint-plugin-react-native-globals"
    ]
  }
]);
