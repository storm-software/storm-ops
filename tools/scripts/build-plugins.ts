import { build } from "esbuild";

Promise.all([
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
    console.log("Storm Workspace plugins built successfully");
  }),
  build({
    entryPoints: ["packages/cloudflare-tools/src/plugin/index.ts"],
    outdir: "dist/plugins/cloudflare",
    tsconfig: "packages/cloudflare-tools/tsconfig.lib.json",
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
    console.log("Storm Cloudflare plugin built successfully");
  })
]).then(() => {
  console.log("All Storm plugin built successfully");
});
