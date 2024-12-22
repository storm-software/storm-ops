import { defineConfig } from "tsup";

export default defineConfig({
  name: "unbuild",
  target: "node22",
  entryPoints: ["./src/*.ts", "./src/plugins/*.ts"],
  format: ["cjs", "esm"],
  splitting: true,
  clean: true,
  sourcemap: true,
  tsconfig: "./tsconfig.json",
  dts: {
    resolve: true,
    // build types for `src/index.ts` only
    entry: "./src/index.ts"
  }
});
