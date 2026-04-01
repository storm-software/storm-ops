import { defineConfig } from "tsup";

export default defineConfig({
  name: "package-constants",
  target: "esnext",
  entryPoints: ["./src/*.ts"],
  format: ["cjs", "esm"],
  platform: "node",
  splitting: true,
  treeshake: true,
  bundle: true,
  clean: true,
  dts: true,
  sourcemap: false,
  tsconfig: "./tsconfig.json",
  skipNodeModulesBundle: true
});
