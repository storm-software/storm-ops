import { defineConfig } from "tsup";

export default defineConfig({
  name: "esbuild",
  target: "node22",
  entryPoints: ["./src/*.ts", "./src/plugins/*.ts"],
  format: ["cjs", "esm"],
  splitting: true,
  clean: true,
  dts: true,
  sourcemap: false,
  tsconfig: "./tsconfig.json",
  external: ["esbuild", "nx", "@nx/*"]
});
