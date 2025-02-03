import { consola } from "consola";
import { build } from "esbuild";

Promise.all([
  build({
    entryPoints: [
      "packages/workspace-tools/src/plugins/rust/index.ts",
      "packages/workspace-tools/src/plugins/typescript/index.ts",
      "packages/workspace-tools/src/plugins/typescript/tsup.ts",
    ],
    outdir: "dist/plugins",
    tsconfig: "packages/workspace-tools/tsconfig.json",
    packages: "external",
    logLevel: "info",
    bundle: true,
    minify: false,
    outExtension: {
      ".js": ".js",
    },
    format: "cjs",
    platform: "node",
  }).then(() => {
    consola.info("Storm Workspace plugins built successfully");
  }),
  build({
    entryPoints: ["packages/cloudflare-tools/src/plugins/index.ts"],
    outdir: "dist/plugins/cloudflare",
    tsconfig: "packages/cloudflare-tools/tsconfig.json",
    packages: "external",
    logLevel: "info",
    bundle: true,
    minify: false,
    outExtension: {
      ".js": ".js",
    },
    format: "cjs",
    platform: "node",
  }).then(() => {
    consola.info("Storm Cloudflare plugin built successfully");
  }),
]).then(() => {
  consola.info("All Storm plugin built successfully");
});
