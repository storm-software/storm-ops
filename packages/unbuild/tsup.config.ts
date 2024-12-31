import { defineConfig } from "tsup";

export default defineConfig({
  name: "unbuild",
  target: "node22",
  entryPoints: ["./src/*.ts", "./src/plugins/*.ts", "./bin/storm-unbuild.ts"],
  format: ["cjs", "esm"],
  platform: "node",
  splitting: true,
  clean: true,
  dts: true,
  sourcemap: false,
  tsconfig: "./tsconfig.json",
  external: ["unbuild", "nx", "@nx/*"]
});
