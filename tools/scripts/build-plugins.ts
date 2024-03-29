import { build } from "esbuild";

build({
  entryPoints: [
    "packages/workspace-tools/src/plugins/rust/index.ts",
    "packages/workspace-tools/src/plugins/typescript/index.ts"
  ],
  outdir: "dist/plugins",
  tsconfig: "packages/workspace-tools/tsconfig.lib.json",
  packages: "external",
  logLevel: "silent",
  bundle: true,
  minify: false,
  outExtension: {
    ".js": ".js"
  },
  format: "cjs",
  platform: "node"
}).then(() => {
  console.log("Plugins built successfully");
});
