import { defineConfig } from "tsup";

export default defineConfig({
  name: "build-tools",
  target: "node22",
  entryPoints: ["./src/*.ts", "./src/utilities/*.ts", "./src/plugins/*.ts"],
  format: ["cjs", "esm"],
  platform: "node",
  splitting: true,
  clean: true,
  dts: true,
  sourcemap: false,
  tsconfig: "./tsconfig.json",
});
