import { build } from "esbuild";

Promise.all([
  // build({
  //   entryPoints: ["packages/eslint/src/preset.ts"],
  //   outdir: "dist/plugins/eslint",
  //   tsconfig: "packages/eslint/tsconfig.json",
  //   logLevel: "info",
  //   bundle: true,
  //   minify: false,
  //   allowOverwrite: true,
  //   write: true,
  //   outExtension: {
  //     ".js": ".mjs"
  //   },
  //   format: "esm",
  //   platform: "node",
  //   external: ["@nx/*", "eslint", "eslint-module-utils"],
  //   legalComments: "inline",
  //   banner: {
  //     js: "const require = (await import('node:module')).createRequire(import.meta.url); \nconst __filename = (await import('node:url')).fileURLToPath(import.meta.url); \nconst __dirname = (await import('node:path')).dirname(__filename);"
  //   }
  //   // plugins: [requireResolvePlugin()]
  // }).then(() => {
  //   console.log("Storm ESLint plugin built successfully");
  // }),
  build({
    entryPoints: [
      "packages/workspace-tools/src/plugins/rust/index.ts",
      "packages/workspace-tools/src/plugins/typescript/index.ts"
    ],
    outdir: "dist/plugins",
    tsconfig: "packages/workspace-tools/tsconfig.lib.json",
    packages: "external",
    logLevel: "info",
    bundle: true,
    minify: false,
    outExtension: {
      ".js": ".js"
    },
    format: "cjs",
    platform: "node"
  }).then(() => {
    console.info("Storm Workspace plugins built successfully");
  }),
  build({
    entryPoints: ["packages/cloudflare-tools/src/plugins/index.ts"],
    outdir: "dist/plugins/cloudflare",
    tsconfig: "packages/cloudflare-tools/tsconfig.lib.json",
    packages: "external",
    logLevel: "info",
    bundle: true,
    minify: false,
    outExtension: {
      ".js": ".js"
    },
    format: "cjs",
    platform: "node"
  }).then(() => {
    console.info("Storm Cloudflare plugin built successfully");
  })
]).then(() => {
  console.info("All Storm plugin built successfully");
});
