import { defineConfig } from "tsup";

export default defineConfig({
  name: "config-tools",
  target: "node22",
  entryPoints: ["./src/**/*.ts"],
  format: ["cjs", "esm"],
  splitting: true,
  clean: true,
  dts: true,
  sourcemap: false,
  tsconfig: "./tsconfig.json"
  // dts: {
  //   resolve: true,
  //   // build types for `src/index.ts` only
  //   entry: "./src/index.ts"
  // }
});
