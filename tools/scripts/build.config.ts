import { defineConfig } from "tsup";

export default defineConfig({
  name: "tools-scripts",
  entryPoints: ["src/*.ts"],
  external: ["tsup"],
  target: "node22",
  format: ["cjs", "esm"],
  bundle: true,
  splitting: true,
  clean: true,
  sourcemap: false,
  tsconfig: "./tsconfig.json",
  dts: {
    resolve: true
  }
});
