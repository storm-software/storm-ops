import { NxJsonConfiguration } from "@nx/devkit";

/**
 * The values provided in the `base.json` (this package's shared nx.json configuration) file's {@link NxJsonConfiguration.namedInputs} section.
 */
export const NAMED_INPUTS = {
  allProjectFiles: ["sharedGlobals", "{projectRoot}/**/*"],
  default: ["sharedGlobals", "{projectRoot}/**/*"],
  sharedGlobals: [
    "{workspaceRoot}/.github/**/*",
    "{workspaceRoot}/assets/**/*",
    "{workspaceRoot}/tsconfig.*.json",
    "{workspaceRoot}/.npm@(rc|ignore)",
    "{workspaceRoot}/package.json",
    "{workspaceRoot}/{pnpm-workspace,pnpm-lock,package-lock,yarn-lock}.@(yaml|yml)",
    "{workspaceRoot}/bun.lockb",
    "{workspaceRoot}/LICENSE",
    "{workspaceRoot}/.git@(attributes|ignore)",
    "{workspaceRoot}/{nx.json,.nxignore}",
    "{workspaceRoot}/storm-workspace{,.*}.@(json|yaml|toml)",
    "{workspaceRoot}/.storm-workspace/config{,.*}.@(json|yaml|toml)",
    "{workspaceRoot}/storm-workspace.config.[jt]s",
    "{workspaceRoot}/.storm-workspace/config{,.*}.[jt]s",
    "{workspaceRoot}/devenv.@(lock|nix|yaml)",
    "{workspaceRoot}/.devenv{,.flake.nix}",
    "{workspaceRoot}/.direnv",
    "{workspaceRoot}/.envrc",
    "{workspaceRoot}/.env{,.local,.*}"
  ],
  production: [
    "{projectRoot}/**/*",
    "!{projectRoot}/{tools,scripts}/**/*",
    "!{projectRoot}/node_modules/**/*",
    "!{projectRoot}/{api-extractor,tsdoc,typedoc}.json",
    "!{projectRoot}/.eslint-doc-generatorrc.@(js|json)",
    "!{projectRoot}/.storybook/**/*",
    "!{projectRoot}/tsconfig.storybook.json",
    "!{projectRoot}/{jest.config,vitest.config}.@(js|cjs|mjs|ts|cts|mts)",
    "!{projectRoot}/tsconfig.spec.json",
    "!{projectRoot}/{src/,}test-setup.[jt]s",
    "!{projectRoot}/.eslintignore",
    "!{projectRoot}/.eslintrc.@(json|cjs)",
    "!{projectRoot}/eslint.config.@(js|cjs|mjs|ts|cts|mts|json)",
    "!{projectRoot}/biome.@(toml|json)",
    "!{projectRoot}/lefthook.@(yaml|yml|json)",
    "!{projectRoot}/.markdownlint.json",
    "!{projectRoot}/.markdownlint-cli2.@(js|cjs|mjs|ts|cts|mts|json)",
    "!{projectRoot}/.prettier@(rc|ignore)",
    "!{projectRoot}/docs/**/*",
    "!{projectRoot}/**/*.stories.@(js|jsx|ts|tsx|mdx)",
    "!{projectRoot}/{benches,e2e,tests,testing}/**/*",
    "!{projectRoot}/**/?(*.)+(spec|test).[jt]s?(x)?(.snap)"
  ],
  testing: [
    "sharedGlobals",
    "{workspaceRoot}/{jest.config,jest.preset,vitest.config,vitest.preset,vitest.workspace}.@(js|cjs|mjs|ts|cts|mts)",
    "{workspaceRoot}/{benches,e2e,tests,testing}/**/*",
    "{workspaceRoot}/coverage/**/*",
    "{projectRoot}/{project.json,README.md,CHANGELOG.md}",
    "{projectRoot}/.env{,.*}",
    "{projectRoot}/{jest.config,vitest.config}.@(js|cjs|mjs|ts|cts|mts)",
    "{projectRoot}/tsconfig.spec.json",
    "{projectRoot}/{src/,}test-setup.[jt]s",
    "{projectRoot}/{benches,e2e,tests,testing}/**/*",
    "{projectRoot}/**/?(*.)+(spec|test).[jt]s?(x)?(.snap)",
    "{projectRoot}/tsconfig.spec.json"
  ],
  linting: [
    "sharedGlobals",
    "{workspaceRoot}/.eslintignore",
    "{workspaceRoot}/.eslintrc.@(js|cjs|mjs|ts|cts|mts|json)",
    "{workspaceRoot}/eslint.config.@(js|cjs|mjs|ts|cts|mts)",
    "{workspaceRoot}/biome.@(toml|json)",
    "{workspaceRoot}/lefthook.@(yaml|yml|json)",
    "{workspaceRoot}/.markdownlint.json",
    "{workspaceRoot}/.markdownlint-cli2.@(js|cjs|mjs|ts|cts|mts|json)",
    "{workspaceRoot}/.prettier@(rc|ignore)",
    "{workspaceRoot}/prettier.config.@(js|cjs|mjs|ts|cts|mts)",
    "{projectRoot}/{project.json,README.md,CHANGELOG.md}",
    "{projectRoot}/.env{,.*}",
    "{projectRoot}/.eslintignore",
    "{projectRoot}/.eslintrc.@(js|cjs|mjs|ts|cts|mts|json)",
    "{projectRoot}/eslint.config.@(js|cjs|mjs|ts|cts|mts)",
    "{projectRoot}/biome.@(toml|json)",
    "{projectRoot}/lefthook.@(yaml|yml|json)",
    "{projectRoot}/.markdownlint.json",
    "{projectRoot}/.markdownlint-cli2.@(js|cjs|mjs|ts|cts|mts|json)",
    "{projectRoot}/.prettier@(rc|ignore)"
  ],
  documentation: [
    "sharedGlobals",
    "{workspaceRoot}/{api-extractor,tsdoc,typedoc}.json",
    "{workspaceRoot}/.eslint-doc-generatorrc.@(js|json)",
    "{workspaceRoot}/contentlayer.config.ts",
    "{workspaceRoot}/*.@(md|mdx)",
    "{workspaceRoot}/docs/**/*",
    "{workspaceRoot}/.storybook/**/*",
    "{projectRoot}/{project.json,README.md,CHANGELOG.md}",
    "{projectRoot}/.env{,.local}",
    "{projectRoot}/{api-extractor,tsdoc,typedoc}.json",
    "{projectRoot}/.eslint-doc-generatorrc.@(js|json)",
    "{projectRoot}/contentlayer.config.ts",
    "{projectRoot}/.storybook/**/*",
    "{projectRoot}/tsconfig.storybook.json",
    "{projectRoot}/docs/**/*",
    "{projectRoot}/**/*.stories.@(js|jsx|ts|tsx|mdx)",
    "!{projectRoot}/{benches,e2e,tests,testing}/**/*",
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
    "{projectRoot}/{project.json,CHANGELOG.md}",
    "{projectRoot}/.env{,.local}",
    "{projectRoot}/**/*.rs",
    "{projectRoot}/**/*.@(proto|acid|acidic|prisma)",
    "{projectRoot}/src/**/*.@(json|jsonc|yaml|yml|toml)",
    "!{projectRoot}/README.md",
    "!{projectRoot}/docs/**/*",
    "!{projectRoot}/{benches,e2e,tests,testing}/**/*"
  ],
  typescript: [
    "sharedGlobals",
    "!{projectRoot}/tsconfig.@(spec|storybook).json",
    "!{projectRoot}/**/?(*.)+(spec|test).[jt]s?(x)?(.snap)",
    "!{projectRoot}/**/*.stories.@(js|jsx|ts|tsx|mdx)",
    "!{projectRoot}/node_modules/**/*",
    "!{projectRoot}/{benches,e2e,tests,testing}/**/*",
    "{projectRoot}/package.json",
    "{projectRoot}/tsconfig.json",
    "{projectRoot}/tsconfig.*.json",
    "{projectRoot}/{project.json,README.md,CHANGELOG.md}",
    "{projectRoot}/.env{,.*}",
    "{projectRoot}/docs/**/*",
    "{projectRoot}/**/*.stories.@(js|jsx|ts|tsx|mdx)",
    "{projectRoot}/**/*.@(proto|acid|acidic|prisma)",
    "{projectRoot}/src/**/*.@(cts|mts|ts|tsx|graphql|gql|js|cjs|mjs|jsx|json|jsonc|yaml|yml|toml|md|mdx)",
    "{projectRoot}/{build,tsup,contentlayer,vite}.*.[jt]s?(x)",
    "{projectRoot}/{bin,tools,helpers,scripts}/**/*"
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
    .concat(namedInputs.flatMap(n => NAMED_INPUTS[n] as unknown as string[]))
    .reduce((ret, inputName) => {
      if (
        Object.keys(NAMED_INPUTS).includes(inputName) &&
        Array.isArray(NAMED_INPUTS[inputName]) &&
        NAMED_INPUTS[inputName].length > 0
      ) {
        NAMED_INPUTS[inputName].forEach(input => {
          if (!ret.includes(input)) {
            ret.push(input);
          }
        });

        return ret;
      }

      if (!ret.includes(inputName)) {
        ret.push(inputName);
      }

      return ret;
    }, [] as string[])
    .sort((a, b) => {
      if (a < b) return -1;
      if (a > b) return 1;
      return 0;
    });
}
