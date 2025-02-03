import { defineConfig } from "tsup";

export default defineConfig({
  name: "markdownlint",
  target: "node22",
  entryPoints: ["./src/index.ts", "./src/rules/*.ts"],
  format: ["cjs", "esm"],
  platform: "node",
  bundle: true,
  splitting: true,
  clean: true,
  dts: true,
  sourcemap: false,
  tsconfig: "./tsconfig.json",
});
