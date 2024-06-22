import { build } from "esbuild";

Promise.all([
  build({
    entryPoints: ["packages/git-tools/bin/git.ts"],
    outdir: "dist/plugins/storm-git",
    tsconfig: "packages/git-tools/tsconfig.json",
    logLevel: "silent",
    bundle: true,
    minify: false,
    outExtension: {
      ".js": ".js"
    },
    platform: "node",
    format: "cjs",
    external: ["nx"]
  }).then(() => {
    console.log("Storm-Git script built successfully");
  }),
  build({
    entryPoints: ["packages/eslint-plugin/src/index.ts"],
    outdir: "dist/plugins/eslint",
    tsconfig: "packages/eslint-plugin/tsconfig.json",
    logLevel: "silent",
    bundle: true,
    minify: false,
    outExtension: {
      ".js": ".mjs"
    },
    format: "esm",
    platform: "node",
    external: ["@nx/*", "eslint"]
  }).then(() => {
    console.log("Storm ESLint plugin built successfully");
  }),
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
