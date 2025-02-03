import { defineConfig } from "tsup";

export default defineConfig({
  name: "tools-scripts",
  entryPoints: ["src/*.ts"],
  external: ["tsup"],
  target: "node22",
  format: ["cjs", "esm"],
  bundle: true,
  splitting: true,
  treeshake: true,
  keepNames: true,
  clean: true,
  sourcemap: false,
  tsconfig: "./tsconfig.json",
  dts: {
    resolve: true
  },
  onSuccess: async () => {
    // eslint-disable-next-line no-console
    console.log("tools-scripts build completed successfully!");
  }
});
