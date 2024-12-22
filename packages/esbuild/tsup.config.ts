import { defineConfig } from "tsup";

export default defineConfig({
  name: "esbuild",
  target: "node18",
  dts: {
    resolve: true,
    // build types for `src/index.ts` only
    entry: "./src/index.ts"
  }
});
