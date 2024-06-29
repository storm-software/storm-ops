import copyFiles from "copyfiles";
import { build } from "esbuild";
import requireResolvePlugin from "@chialab/esbuild-plugin-require-resolve";

copyFiles(["LICENSE", "dist/packages/eslint-plugin-graphql"], {}, () => {
  copyFiles(
    [
      "packages/eslint-plugin-graphql/package.json",
      "packages/eslint-plugin-graphql/*.md",
      "dist/packages/eslint-plugin-graphql"
    ],
    { up: 2 },
    () => {
      Promise.all([
        build({
          entryPoints: ["packages/eslint-plugin-graphql/src/index.ts"],
          outdir: "dist/packages/eslint-plugin-graphql/esm",
          tsconfig: "packages/eslint-plugin-graphql/tsconfig.esm.json",
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
          external: ["@nx/*", "eslint-module-utils", "eslint", "graphql"],
          legalComments: "inline",
          banner: {
            js: "const require = (await import('node:module')).createRequire(import.meta.url); \nconst __filename = (await import('node:url')).fileURLToPath(import.meta.url); \nconst __dirname = (await import('node:path')).dirname(__filename);"
          },
          plugins: [requireResolvePlugin()]
        }).then(() => {
          console.log("Storm ESLint GraphQL Plugin (ESM) built successfully");
        }),
        build({
          entryPoints: ["packages/eslint-plugin-graphql/src/index.ts"],
          outdir: "dist/packages/eslint-plugin-graphql/cjs",
          tsconfig: "packages/eslint-plugin-graphql/tsconfig.cjs.json",
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
          external: ["@nx/*", "eslint-module-utils", "eslint"],
          plugins: [requireResolvePlugin()]
        }).then(() => {
          console.log("Storm ESLint GraphQL Plugin (CJS) built successfully");
        }),
        build({
          entryPoints: ["packages/eslint-plugin-graphql/src/types.ts"],
          outdir: "dist/packages/eslint-plugin-graphql/esm",
          tsconfig: "packages/eslint-plugin-graphql/tsconfig.esm.json",
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
          console.log(
            "Storm ESLint GraphQL Plugin Types (ESM) built successfully"
          );
        }),
        build({
          entryPoints: ["packages/eslint-plugin-graphql/src/types.ts"],
          outdir: "dist/packages/eslint-plugin-graphql/cjs",
          tsconfig: "packages/eslint-plugin-graphql/tsconfig.cjs.json",
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
          console.log(
            "Storm ESLint GraphQL Plugin Types (CJS) built successfully"
          );
        }),
        build({
          entryPoints: ["packages/eslint-plugin-graphql/src/configs.ts"],
          outdir: "dist/packages/eslint-plugin-graphql/esm",
          tsconfig: "packages/eslint-plugin-graphql/tsconfig.esm.json",
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
          external: ["@nx/*", "eslint-module-utils", "eslint"],
          legalComments: "inline",
          banner: {
            js: "const require = (await import('node:module')).createRequire(import.meta.url); \nconst __filename = (await import('node:url')).fileURLToPath(import.meta.url); \nconst __dirname = (await import('node:path')).dirname(__filename);"
          },
          plugins: [requireResolvePlugin()]
        }).then(() => {
          console.log(
            "Storm ESLint GraphQL Plugin Configuration (ESM) built successfully"
          );
        }),
        build({
          entryPoints: ["packages/eslint-plugin-graphql/src/configs.ts"],
          outdir: "dist/packages/eslint-plugin-graphql/cjs",
          tsconfig: "packages/eslint-plugin-graphql/tsconfig.cjs.json",
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
          external: ["@nx/*", "eslint-module-utils", "eslint"],
          plugins: [requireResolvePlugin()]
        }).then(() => {
          console.log(
            "Storm ESLint GraphQL Plugin Configuration (CJS) built successfully"
          );
        })
      ]).then(() => {
        console.log("All Storm ESLint plugins built successfully");
      });
    }
  );
});
