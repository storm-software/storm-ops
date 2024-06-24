import copyFiles from "copyfiles";
import { build } from "esbuild";
import requireResolvePlugin from "@chialab/esbuild-plugin-require-resolve";

copyFiles(["LICENSE", "dist/packages/eslint"], {}, () => {
  copyFiles(
    [
      "packages/eslint/package.json",
      "packages/eslint/*.md",
      "dist/packages/eslint"
    ],
    { up: 2 },
    () => {
      Promise.all([
        build({
          entryPoints: [
            "packages/eslint/src/index.ts",
            "packages/eslint/src/utils/index.ts",
            "packages/eslint/src/base.ts",
            "packages/eslint/src/graphql.ts",
            "packages/eslint/src/json.ts",
            "packages/eslint/src/next.ts",
            "packages/eslint/src/react.ts",
            "packages/eslint/src/react-native.ts",
            "packages/eslint/src/electron.ts",
            "packages/eslint/src/markdown.ts",
            "packages/eslint/src/yml.ts",
            "packages/eslint/src/tsdoc.ts",
            "packages/eslint/src/nx.ts"
          ],
          outdir: "dist/packages/eslint/esm",
          tsconfig: "packages/eslint/tsconfig.esm.json",
          logLevel: "error",
          bundle: true,
          minify: false,
          allowOverwrite: true,
          write: true,
          // outExtension: {
          //   ".js": ".mjs"
          // },
          format: "esm",
          platform: "node",
          external: ["@nx/*", "eslint", "eslint-module-utils", "graphql"],
          legalComments: "inline",
          banner: {
            js: "const require = (await import('node:module')).createRequire(import.meta.url); \nconst __filename = (await import('node:url')).fileURLToPath(import.meta.url); \nconst __dirname = (await import('node:path')).dirname(__filename);"
          },
          plugins: [requireResolvePlugin()]
        }).then(() => {
          console.log("Storm ESLint (ESM) built successfully");
        }),
        build({
          entryPoints: [
            "packages/eslint/src/index.ts",
            "packages/eslint/src/utils/index.ts",
            "packages/eslint/src/base.ts",
            "packages/eslint/src/graphql.ts",
            "packages/eslint/src/json.ts",
            "packages/eslint/src/next.ts",
            "packages/eslint/src/react.ts",
            "packages/eslint/src/react-native.ts",
            "packages/eslint/src/electron.ts",
            "packages/eslint/src/markdown.ts",
            "packages/eslint/src/yml.ts",
            "packages/eslint/src/tsdoc.ts",
            "packages/eslint/src/nx.ts"
          ],
          outdir: "dist/packages/eslint/cjs",
          tsconfig: "packages/eslint/tsconfig.cjs.json",
          logLevel: "error",
          bundle: true,
          minify: false,
          allowOverwrite: true,
          write: true,
          outExtension: {
            ".js": ".cjs"
          },
          format: "cjs",
          platform: "node",
          external: ["@nx/*", "eslint", "eslint-module-utils", "graphql"],
          plugins: [requireResolvePlugin()]
        }).then(() => {
          console.log("Storm ESLint (CJS) built successfully");
        })
      ]).then(() => {
        console.log("All Storm plugin built successfully");
      });
    }
  );
});
