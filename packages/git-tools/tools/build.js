import copyFiles from "copyfiles";
import { build } from "esbuild";
import requireResolvePlugin from "@chialab/esbuild-plugin-require-resolve";

copyFiles(["LICENSE", "dist/packages/git-tools"], {}, () => {
  copyFiles(
    [
      "packages/git-tools/package.json",
      "packages/git-tools/*.md",
      "packages/git-tools/declarations.d.ts",
      "packages/git-tools/bin/**/{*,*.*}",
      "dist/packages/git-tools"
    ],
    { up: 2 },
    () => {
      copyFiles(
        [
          "packages/git-tools/src/lint-staged/**/*.cjs",
          "dist/packages/git-tools/lint-staged"
        ],
        { up: 4 },
        () => {
          copyFiles(
            [
              "packages/git-tools/src/lefthook/lefthook.yml",
              "dist/packages/git-tools/lefthook"
            ],
            { up: 4 },
            () => {
              copyFiles(
                [
                  "packages/git-tools/src/readme/templates/**/*.*",
                  "dist/packages/git-tools/readme/templates"
                ],
                { up: 5 },
                () => {
                  copyFiles(
                    [
                      "packages/git-tools/src/commitlint/commitlint.config.cjs",
                      "dist/packages/git-tools/commitlint"
                    ],
                    { up: 4 },
                    () => {
                      Promise.all([
                        build({
                          "entryPoints": [
                            "packages/git-tools/src/index.ts",
                            "packages/git-tools/src/cli/index.ts",
                            "packages/git-tools/bin/git.ts",
                            "packages/git-tools/bin/pre-install.ts",
                            "packages/git-tools/bin/prepare.ts",
                            "packages/git-tools/bin/post-checkout.ts",
                            "packages/git-tools/bin/post-commit.ts",
                            "packages/git-tools/bin/post-merge.ts",
                            "packages/git-tools/bin/pre-commit.ts",
                            "packages/git-tools/bin/pre-push.ts",
                            "packages/git-tools/bin/version-warning.ts",
                            "packages/git-tools/src/utilities/index.ts",
                            "packages/git-tools/src/commitizen/index.ts",
                            "packages/git-tools/src/commitlint/config.ts",
                            "packages/git-tools/src/commit/index.ts",
                            "packages/git-tools/src/commit/config.ts",
                            "packages/git-tools/src/release/index.ts",
                            "packages/git-tools/src/release/changelog-renderer.ts"
                          ],
                          outdir: "dist/packages/git-tools",
                          tsconfig: "packages/git-tools/tsconfig.json",
                          logLevel: "error",
                          bundle: true,
                          minify: false,
                          allowOverwrite: true,
                          write: true,
                          format: "esm",
                          platform: "node",
                          external: ["nx"],
                          legalComments: "inline",
                          banner: {
                            js: "const require = (await import('node:module')).createRequire(import.meta.url);"
                          },
                          plugins: [requireResolvePlugin()]
                        }).then(() => {
                          console.log(
                            "Storm Git Tools (ESM) built successfully"
                          );
                        })
                      ]).then(() => {
                        console.log(
                          "All Storm Git Tools packages built successfully"
                        );
                      });
                    }
                  );
                }
              );
            }
          );
        }
      );
    }
  );
});
