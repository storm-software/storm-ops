import { NxJsonConfiguration } from "@nx/devkit";

/**
 * The values provided in the `base.json` (this package's shared nx.json configuration) file's {@link NxJsonConfiguration.namedInputs} section.
 */
export const NAMED_INPUTS = {
  allProjectFiles: ["sharedGlobals", "{projectRoot}/**/*"],
  sharedGlobals: [
    "{workspaceRoot}/.github/**/*",
    "{workspaceRoot}/.gitattributes",
    "{workspaceRoot}/.gitignore",
    "{workspaceRoot}/assets/**/*",
    "{workspaceRoot}/tsconfig.*.json",
    "{workspaceRoot}/.npmrc",
    "{workspaceRoot}/.npmignore",
    "{workspaceRoot}/package.json",
    "{workspaceRoot}/pnpm-workspace.yaml",
    "{workspaceRoot}/LICENSE",
    "{workspaceRoot}/nx.json",
    "{workspaceRoot}/.nxignore",
    "{workspaceRoot}/storm-workspace.json",
    "{workspaceRoot}/storm-workspace.*.json",
    "{workspaceRoot}/.storm-workspace/config.json",
    "{workspaceRoot}/.storm-workspace/config.*.json",
    "{workspaceRoot}/storm-workspace.yaml",
    "{workspaceRoot}/storm-workspace.*.yaml",
    "{workspaceRoot}/.storm-workspace/config.yaml",
    "{workspaceRoot}/.storm-workspace/config.*.yaml",
    "{workspaceRoot}/storm-workspace.toml",
    "{workspaceRoot}/storm-workspace.*.toml",
    "{workspaceRoot}/.storm-workspace/config.toml",
    "{workspaceRoot}/.storm-workspace/config.*.toml",
    "{workspaceRoot}/storm-workspace.config.js",
    "{workspaceRoot}/.storm-workspace/config.js",
    "{workspaceRoot}/.storm-workspace/config.*.js",
    "{workspaceRoot}/storm-workspace.config.ts",
    "{workspaceRoot}/.storm-workspace/config.ts",
    "{workspaceRoot}/.storm-workspace/config.*.ts",
    "{workspaceRoot}/devenv.lock",
    "{workspaceRoot}/devenv.nix",
    "{workspaceRoot}/devenv.yaml",
    "{workspaceRoot}/.devenv.flake.nix",
    "{workspaceRoot}/.devenv",
    "{workspaceRoot}/.direnv",
    "{workspaceRoot}/.env",
    "{workspaceRoot}/.envrc",
    "{workspaceRoot}/.env.*"
  ],
  production: [
    "{projectRoot}/**/*",
    "!{projectRoot}/dist/**/*",
    "!{projectRoot}/tools/**/*",
    "!{projectRoot}/scripts/**/*",
    "!{projectRoot}/node_modules/**/*",
    "!{projectRoot}/api-extractor.json",
    "!{projectRoot}/tsdoc.json",
    "!{projectRoot}/typedoc.json",
    "!{projectRoot}/.eslint-doc-generatorrc.js",
    "!{projectRoot}/.eslint-doc-generatorrc.json",
    "!{projectRoot}/.storybook/**/*",
    "!{projectRoot}/tsconfig.storybook.json",
    "!{projectRoot}/jest.config.ts",
    "!{projectRoot}/tsconfig.spec.json",
    "!{projectRoot}/src/test-setup.[jt]s",
    "!{projectRoot}/test-setup.[jt]s",
    "!{projectRoot}/tsconfig.spec.json",
    "!{projectRoot}/.eslintignore",
    "!{projectRoot}/.eslintrc.json",
    "!{projectRoot}/.eslintrc.cjs",
    "!{projectRoot}/eslint.config.js",
    "!{projectRoot}/eslint.config.cjs",
    "!{projectRoot}/eslint.config.mjs",
    "!{projectRoot}/biome.toml",
    "!{projectRoot}/biome.json",
    "!{projectRoot}/lefthook.yaml",
    "!{projectRoot}/lefthook.json",
    "!{projectRoot}/.markdownlint.json",
    "!{projectRoot}/.markdownlint-cli2.cjs",
    "!{projectRoot}/.prettierrc",
    "!{projectRoot}/.prettierignore",
    "!{projectRoot}/docs/**/*",
    "!{projectRoot}/**/*.stories.@(js|jsx|ts|tsx|mdx)",
    "!{projectRoot}/benches/**/*",
    "!{projectRoot}/e2e/**/*",
    "!{projectRoot}/tests/**/*",
    "!{projectRoot}/testing/**/*",
    "!{projectRoot}/**/?(*.)+(spec|test).[jt]s?(x)?(.snap)",
    "!{projectRoot}/tsconfig.spec.json"
  ],
  testing: [
    "sharedGlobals",
    "{workspaceRoot}/jest.config.ts",
    "{workspaceRoot}/jest.preset.js",
    "{workspaceRoot}/benches/**/*",
    "{workspaceRoot}/e2e/**/*",
    "{workspaceRoot}/tests/**/*",
    "{workspaceRoot}/testing/**/*",
    "{workspaceRoot}/coverage/**/*",
    "{projectRoot}/project.json",
    "{projectRoot}/.env",
    "{projectRoot}/.env.local",
    "{projectRoot}/jest.config.ts",
    "{projectRoot}/tsconfig.spec.json",
    "{projectRoot}/src/test-setup.[jt]s",
    "{projectRoot}/test-setup.[jt]s",
    "{projectRoot}/tsconfig.spec.json",
    "{workspaceRoot}/jest.config.ts",
    "{workspaceRoot}/jest.preset.js",
    "{workspaceRoot}/benches/**/*",
    "{workspaceRoot}/e2e/**/*",
    "{workspaceRoot}/tests/**/*",
    "{workspaceRoot}/testing/**/*",
    "{workspaceRoot}/coverage/**/*",
    "{projectRoot}/benches/**/*",
    "{projectRoot}/e2e/**/*",
    "{projectRoot}/tests/**/*",
    "{projectRoot}/testing/**/*",
    "{projectRoot}/**/?(*.)+(spec|test).[jt]s?(x)?(.snap)",
    "{projectRoot}/tsconfig.spec.json"
  ],
  linting: [
    "sharedGlobals",
    "{workspaceRoot}/.eslintignore",
    "{workspaceRoot}/eslintrc.json",
    "{workspaceRoot}/.eslintrc",
    "{workspaceRoot}/.eslintrc.json",
    "{workspaceRoot}/.eslintrc.js",
    "{workspaceRoot}/.eslintrc.cjs",
    "{workspaceRoot}/.eslintrc.mjs",
    "{workspaceRoot}/eslint.*.json",
    "{workspaceRoot}/eslint.*.js",
    "{workspaceRoot}/eslint.*.cjs",
    "{workspaceRoot}/eslint.*.mjs",
    "{workspaceRoot}/eslint.*.ts",
    "{workspaceRoot}/biome.toml",
    "{workspaceRoot}/biome.json",
    "{workspaceRoot}/lefthook.yaml",
    "{workspaceRoot}/lefthook.json",
    "{workspaceRoot}/.markdownlint.json",
    "{workspaceRoot}/.markdownlint-cli2.cjs",
    "{workspaceRoot}/.prettierrc",
    "{workspaceRoot}/prettier.config.js",
    "{workspaceRoot}/.prettierignore",
    "{projectRoot}/project.json",
    "{projectRoot}/.env",
    "{projectRoot}/.env.local",
    "{projectRoot}/.eslintignore",
    "{projectRoot}/eslintrc.json",
    "{projectRoot}/.eslintrc",
    "{projectRoot}/.eslintrc.json",
    "{projectRoot}/.eslintrc.js",
    "{projectRoot}/.eslintrc.cjs",
    "{projectRoot}/.eslintrc.mjs",
    "{projectRoot}/eslint.*.json",
    "{projectRoot}/eslint.*.js",
    "{projectRoot}/eslint.*.cjs",
    "{projectRoot}/eslint.*.mjs",
    "{projectRoot}/eslint.*.ts",
    "{projectRoot}/biome.toml",
    "{projectRoot}/biome.json",
    "{projectRoot}/lefthook.yaml",
    "{projectRoot}/lefthook.json",
    "{projectRoot}/.markdownlint.json",
    "{projectRoot}/.markdownlint-cli2.cjs",
    "{projectRoot}/.prettierrc",
    "{projectRoot}/.prettierignore"
  ],
  documentation: [
    "sharedGlobals",
    "{workspaceRoot}/api-extractor.json",
    "{workspaceRoot}/tsdoc.json",
    "{workspaceRoot}/typedoc.json",
    "{workspaceRoot}/.eslint-doc-generatorrc.js",
    "{workspaceRoot}/.eslint-doc-generatorrc.json",
    "{workspaceRoot}/contentlayer.config.ts",
    "{workspaceRoot}/*.md",
    "{workspaceRoot}/*.mdx",
    "{workspaceRoot}/docs/**/*",
    "{workspaceRoot}/.storybook/**/*",
    "{projectRoot}/project.json",
    "{projectRoot}/README.md",
    "{projectRoot}/CHANGELOG.md",
    "{projectRoot}/.env",
    "{projectRoot}/.env.local",
    "{projectRoot}/api-extractor.json",
    "{projectRoot}/tsdoc.json",
    "{projectRoot}/typedoc.json",
    "{projectRoot}/.eslint-doc-generatorrc.js",
    "{projectRoot}/.eslint-doc-generatorrc.json",
    "{projectRoot}/contentlayer.config.ts",
    "{projectRoot}/.storybook/**/*",
    "{projectRoot}/tsconfig.storybook.json",
    "{projectRoot}/README.md",
    "{projectRoot}/docs/**/*",
    "{projectRoot}/**/*.stories.@(js|jsx|ts|tsx|mdx)",
    "!{projectRoot}/benches/**/*",
    "!{projectRoot}/e2e/**/*",
    "!{projectRoot}/tests/**/*",
    "!{projectRoot}/testing/**/*",
    "!{projectRoot}/**/?(*.)+(spec|test).[jt]s?(x)?(.snap)",
    "!{projectRoot}/tsconfig.spec.json"
  ],
  rust: [
    "sharedGlobals",
    "{workspaceRoot}/Cargo.toml",
    "{workspaceRoot}/Cargo.lock",
    "{workspaceRoot}/.cargo/config.toml",
    "{workspaceRoot}/rust-toolchain",
    "{workspaceRoot}/rustfmt.toml",
    "{workspaceRoot}/deny.toml",
    "{projectRoot}/Cargo.toml",
    "{projectRoot}/.cargo/config.toml",
    {
      runtime: "node -p '`${process.platform}_${process.arch}`'"
    },
    "{projectRoot}/project.json",
    "{projectRoot}/README.md",
    "{projectRoot}/CHANGELOG.md",
    "{projectRoot}/.env",
    "{projectRoot}/.env.local",
    "{projectRoot}/**/*.rs",
    "{projectRoot}/**/*.proto",
    "{projectRoot}/**/*.acid",
    "{projectRoot}/**/*.acidic",
    "{projectRoot}/**/*.prisma",
    "{projectRoot}/src/**/*.json",
    "{projectRoot}/src/**/*.jsonc",
    "{projectRoot}/src/**/*.yaml",
    "{projectRoot}/src/**/*.yml",
    "{projectRoot}/src/**/*.toml",
    {
      runtime: "node -p '`${process.platform}_${process.arch}`'"
    },
    "!{projectRoot}/README.md",
    "!{projectRoot}/docs/**/*",
    "!{projectRoot}/benches/**/*",
    "!{projectRoot}/e2e/**/*",
    "!{projectRoot}/tests/**/*",
    "!{projectRoot}/testing/**/*"
  ],
  typescript: [
    "sharedGlobals",
    "!{projectRoot}/tsconfig.spec.json",
    "!{projectRoot}/tsconfig.storybook.json",
    "!{projectRoot}/**/?(*.)+(spec|test).[jt]s?(x)?(.snap)",
    "!{projectRoot}/**/*.stories.@(js|jsx|ts|tsx|mdx)",
    "!{projectRoot}/node_modules/**/*",
    "!{projectRoot}/dist/**/*",
    "!{projectRoot}/benches/**/*",
    "!{projectRoot}/e2e/**/*",
    "!{projectRoot}/tests/**/*",
    "!{projectRoot}/testing/**/*",
    "{projectRoot}/package.json",
    "{projectRoot}/tsconfig.json",
    "{projectRoot}/tsconfig.*.json",
    "{projectRoot}/project.json",
    "{projectRoot}/.env",
    "{projectRoot}/.env.*",
    "{projectRoot}/**/*.proto",
    "{projectRoot}/**/*.acid",
    "{projectRoot}/**/*.acidic",
    "{projectRoot}/**/*.prisma",
    "{projectRoot}/src/**/*.cts",
    "{projectRoot}/src/**/*.mts",
    "{projectRoot}/src/**/*.ts",
    "{projectRoot}/src/**/*.tsx",
    "{projectRoot}/src/**/*.graphql",
    "{projectRoot}/src/**/*.gql",
    "{projectRoot}/src/**/*.js",
    "{projectRoot}/src/**/*.cjs",
    "{projectRoot}/src/**/*.mjs",
    "{projectRoot}/src/**/*.jsx",
    "{projectRoot}/src/**/*.json",
    "{projectRoot}/src/**/*.jsonc",
    "{projectRoot}/src/**/*.yaml",
    "{projectRoot}/src/**/*.yml",
    "{projectRoot}/src/**/*.toml",
    "{projectRoot}/src/**/*.md",
    "{projectRoot}/src/**/*.mdx",
    "{projectRoot}/build.*.[jt]s?(x)",
    "{projectRoot}/tsup.*.[jt]s?(x)",
    "{projectRoot}/vite.*.[jt]s?(x)",
    "{projectRoot}/contentlayer.*.[jt]s?(x)",
    "{projectRoot}/bin/**/*",
    "{projectRoot}/helpers/**/*"
  ]
} as const;

/**
 * The values provided in the `base.json` (this package's shared nx.json configuration) file's {@link NxJsonConfiguration.release} section.
 */
export const RELEASE: NxJsonConfiguration["release"] = {
  groups: {
    packages: {
      projects: ["packages/*", "crates/*"],
      projectsRelationship: "independent",
      releaseTagPattern: "{projectName}@{version}",
      changelog: {
        entryWhenNoChanges: false,
        renderOptions: {
          authors: false,
          commitReferences: true,
          versionTitleDate: true
        }
      },
      version: {
        groupPreVersionCommand: "pnpm build",
        currentVersionResolver: "git-tag",
        specifierSource: "conventional-commits",

        versionActions: "@storm-software/workspace-tools:release-version",
        versionActionsOptions: {
          currentVersionResolver: "git-tag",
          specifierSource: "conventional-commits"
        }
      },
      releaseTag: {
        pattern: "{projectName}@{version}"
      }
    }
  }
} as const;

/**
 * Looks up the actual input string using the provided {@link namedInputs}, merges with the {@link currentInputs}, ensures no duplicates and sorts the result alphabetically.
 *
 * @param namedInputs - The named inputs to merge.
 * @param currentInputs - The current inputs to merge with.
 * @returns An array of unique input names.
 */
export function withNamedInputs(
  currentInputs: string[] = [],
  namedInputs: (keyof typeof NAMED_INPUTS)[] = []
): string[] {
  return currentInputs
    .concat(namedInputs.flatMap(n => Object.keys(NAMED_INPUTS[n])))
    .reduce((ret, input) => {
      if (
        Object.keys(NAMED_INPUTS).includes(input) &&
        Array.isArray(NAMED_INPUTS[input]) &&
        NAMED_INPUTS[input].length > 0
      ) {
        NAMED_INPUTS[input].forEach(key => {
          if (!ret.includes(NAMED_INPUTS[key])) {
            ret.push(NAMED_INPUTS[key]);
          }
        });

        return ret;
      }

      if (!ret.includes(input)) {
        ret.push(input);
      }

      return ret;
    }, [] as string[])
    .sort((a, b) => {
      if (a < b) return -1;
      if (a > b) return 1;
      return 0;
    });
}
