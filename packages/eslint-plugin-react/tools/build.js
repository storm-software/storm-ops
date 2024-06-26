import copyFiles from "copyfiles";
import { build } from "esbuild";
import requireResolvePlugin from "@chialab/esbuild-plugin-require-resolve";

copyFiles(["LICENSE", "dist/packages/eslint-plugin-react"], {}, () => {
  copyFiles(
    [
      "packages/eslint-plugin-react/package.json",
      "packages/eslint-plugin-react/*.md",
      "dist/packages/eslint-plugin-react"
    ],
    { up: 2 },
    () => {
      Promise.all([
        build({
          entryPoints: ["packages/eslint-plugin-react/src/index.ts"],
          outdir: "dist/packages/eslint-plugin-react/esm",
          tsconfig: "packages/eslint-plugin-react/tsconfig.esm.json",
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
          // banner: {
          //   js: "const require = (await import('node:module')).createRequire(import.meta.url); \nconst __filename = (await import('node:url')).fileURLToPath(import.meta.url); \nconst __dirname = (await import('node:path')).dirname(__filename);"
          // },
          plugins: [requireResolvePlugin()]
        }).then(() => {
          console.log("Storm ESLint React Plugin (ESM) built successfully");
        }),
        build({
          entryPoints: ["packages/eslint-plugin-react/src/index.ts"],
          outdir: "dist/packages/eslint-plugin-react/cjs",
          tsconfig: "packages/eslint-plugin-react/tsconfig.cjs.json",
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
          console.log("Storm ESLint React Plugin (CJS) built successfully");
        }),
        build({
          entryPoints: ["packages/eslint-plugin-react/src/types.ts"],
          outdir: "dist/packages/eslint-plugin-react/esm",
          tsconfig: "packages/eslint-plugin-react/tsconfig.esm.json",
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
          external: ["@nx/*", "eslint", "eslint-module-utils"],
          legalComments: "inline",
          // banner: {
          //   js: "const require = (await import('node:module')).createRequire(import.meta.url); \nconst __filename = (await import('node:url')).fileURLToPath(import.meta.url); \nconst __dirname = (await import('node:path')).dirname(__filename);"
          // },
          plugins: [requireResolvePlugin()]
        }).then(() => {
          console.log(
            "Storm ESLint React Plugin Types (ESM) built successfully"
          );
        }),
        build({
          entryPoints: ["packages/eslint-plugin-react/src/types.ts"],
          outdir: "dist/packages/eslint-plugin-react/cjs",
          tsconfig: "packages/eslint-plugin-react/tsconfig.cjs.json",
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
          external: ["@nx/*", "eslint", "eslint-module-utils"],
          plugins: [requireResolvePlugin()]
        }).then(() => {
          console.log(
            "Storm ESLint React Plugin Types (CJS) built successfully"
          );
        }),
        build({
          entryPoints: ["packages/eslint-plugin-react/src/configs.ts"],
          outdir: "dist/packages/eslint-plugin-react/esm",
          tsconfig: "packages/eslint-plugin-react/tsconfig.esm.json",
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
          // banner: {
          //   js: "const require = (await import('node:module')).createRequire(import.meta.url); \nconst __filename = (await import('node:url')).fileURLToPath(import.meta.url); \nconst __dirname = (await import('node:path')).dirname(__filename);"
          // },
          plugins: [requireResolvePlugin()]
        }).then(() => {
          console.log(
            "Storm ESLint React Plugin Configuration (ESM) built successfully"
          );
        }),
        build({
          entryPoints: ["packages/eslint-plugin-react/src/configs.ts"],
          outdir: "dist/packages/eslint-plugin-react/cjs",
          tsconfig: "packages/eslint-plugin-react/tsconfig.cjs.json",
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
            "Storm ESLint React Plugin Configuration (CJS) built successfully"
          );
        })
      ]).then(() => {
        console.log("All Storm ESLint plugins built successfully");
      });
    }
  );
});
