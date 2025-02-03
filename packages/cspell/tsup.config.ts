import { defineConfig } from "tsup";

export default defineConfig({
  name: "cspell",
  target: "node22",
  entryPoints: ["./index.ts"],
  format: ["cjs", "esm"],
  platform: "node",
  bundle: true,
  splitting: true,
  clean: true,
  dts: true,
  sourcemap: false,
  tsconfig: "./tsconfig.json",
  external: ["tsup"],
  noExternal: ["cspell", "@cspell/*"],
  skipNodeModulesBundle: false,
});
