import {
  NX_DEFAULT_BUILD_OUTPUTS as BASE_NX_DEFAULT_BUILD_OUTPUTS,
  NxWorkspace
} from "@aws/pdk/monorepo/components/nx-workspace";
import { Nx } from "@aws/pdk/monorepo/nx-types";
import { ProjectUtils } from "@aws/pdk/monorepo/utils";
import { asUndefinedIfEmpty } from "@aws/pdk/monorepo/utils/common";
import { NxJsonConfiguration } from "@nx/devkit";
import { StormWorkspaceConfig } from "@storm-software/config";
import { joinPaths } from "@storm-software/config-tools/utilities/correct-paths";
import { readFileSync } from "node:fs";
import { JsonFile, Project } from "projen";
import { Obj } from "projen/lib/util";

/**
 * Default NX outputs to cache
 */
export const NX_DEFAULT_BUILD_OUTPUTS: string[] = [
  ...BASE_NX_DEFAULT_BUILD_OUTPUTS,
  "{workspaceRoot}/dist/{projectRoot}"
];

/**
 * Component which manages the workspace specific NX Config for the root monorepo.
 */
export class StormNxWorkspace extends NxWorkspace {
  /**
   * Retrieves the singleton instance associated with project root.
   *
   * @param scope project instance.
   */
  static override of(scope: Project): NxWorkspace | undefined {
    return scope.root.components.find(c =>
      ProjectUtils.isNamedInstanceOf(c, NxWorkspace)
    ) as NxWorkspace | undefined;
  }

  /**
   * Raw nx.json file to support overrides that aren't handled
   * directly.
   *
   * **Attention:** any overrides applied here will not be visible
   * in the properties and only included in final synthesized output,
   * and likely to override native handling.
   * @advanced
   */
  public override readonly nxJson: JsonFile;

  /**
   * Automatically infer NxProject targets based on project type.
   * @experimental
   */
  public override autoInferProjectTargets = true;

  /**
   * List of cacheable operations.
   */
  public override cacheableOperations: string[] = [
    "lint-sherif",
    "lint-knip",
    "lint-ls",
    "lint",
    "format-readme",
    "format-toml",
    "format-prettier",
    "format",
    "clean",
    "build-base",
    "build",
    "test",
    "e2e",
    "docs",
    "nx-release-publish"
  ];

  /**
   * Some presets use the extends property to hide some default options in a separate json file.
   * The json file specified in the extends property is located in your node_modules folder.
   * The Nx preset files are specified in the nx package.
   *
   * @default "@storm-software/workspace-tools/config/base.json"
   */
  public override extends = "@storm-software/workspace-tools/config/base.json";

  /**
   * Plugins for extending the project graph
   */
  public nxPlugins: NxJsonConfiguration["plugins"] = [
    {
      plugin: "@nx/eslint/plugin",
      exclude: ["packages/**/__fixtures__/**/*"],
      options: {
        targetName: "lint",
        useFlatConfig: true
      }
    },
    "@storm-software/workspace-tools/plugins/typescript",
    "@storm-software/workspace-tools/plugins/typescript/untyped",
    "@storm-software/workspace-tools/plugins/typescript/tsup"
  ];

  /**
   * Default options for `nx affected`
   */
  public override affected: Nx.INxAffectedConfig = {
    defaultBase: "main"
  };

  /**
   * Named inputs
   * @see https://nx.dev/reference/nx-json#inputs-&-namedinputs
   */
  public override namedInputs: Nx.INamedInputs = {
    // https://nx.dev/more-concepts/customizing-inputs#defaults
    sharedGlobals: [
      "{workspaceRoot}/.github/**/*",
      "{workspaceRoot}/assets/**/*",
      "{workspaceRoot}/tsconfig.*.json",
      "{workspaceRoot}/.npmrc",
      "{workspaceRoot}/.npmignore",
      "{workspaceRoot}/package.json",
      "{workspaceRoot}/pnpm-workspace.yaml",
      "{workspaceRoot}/pnpm-lock.yaml",
      "{workspaceRoot}/package-lock.yaml",
      "{workspaceRoot}/yarn-lock.yaml",
      "{workspaceRoot}/bun.lockb",
      "{workspaceRoot}/LICENSE",
      "{workspaceRoot}/.gitattributes",
      "{workspaceRoot}/.gitignore",
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
      "{workspaceRoot}/.env",
      "{workspaceRoot}/.env.local"
    ],
    default: ["sharedGlobals", "{projectRoot}/**/*"],
    production: [
      "{projectRoot}/**/*",
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
      "{projectRoot}/README.md",
      "{projectRoot}/CHANGELOG.md",
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
      "{workspaceRoot}/.eslintrc.json",
      "{workspaceRoot}/.eslintrc.cjs",
      "{workspaceRoot}/eslint.config.js",
      "{workspaceRoot}/eslint.config.cjs",
      "{workspaceRoot}/eslint.config.mjs",
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
      "{projectRoot}/README.md",
      "{projectRoot}/CHANGELOG.md",
      "{projectRoot}/.env",
      "{projectRoot}/.env.local",
      "{projectRoot}/.eslintignore",
      "{projectRoot}/.eslintrc",
      "{projectRoot}/.eslintrc.json",
      "{projectRoot}/.eslintrc.cjs",
      "{projectRoot}/eslint.config.js",
      "{projectRoot}/eslint.config.cjs",
      "{projectRoot}/eslint.config.mjs",
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
      "!{projectRoot}/benches/**/*",
      "!{projectRoot}/e2e/**/*",
      "!{projectRoot}/tests/**/*",
      "!{projectRoot}/testing/**/*",
      "!{projectRoot}/**/?(*.)+(spec|test).[jt]s?(x)?(.snap)",
      "!{projectRoot}/tsconfig.spec.json",
      "!{projectRoot}/**/?(*.)+(spec|test).[jt]s?(x)?(.snap)",
      "!{projectRoot}/**/*.stories.@(js|jsx|ts|tsx|mdx)",
      "!{projectRoot}/node_modules/**/*",
      "{projectRoot}/package.json",
      "{projectRoot}/tsconfig.json",
      "{projectRoot}/tsconfig.*.json",
      "{projectRoot}/project.json",
      "{projectRoot}/README.md",
      "{projectRoot}/CHANGELOG.md",
      "{projectRoot}/.env",
      "{projectRoot}/.env.*",
      "{projectRoot}/README.md",
      "{projectRoot}/docs/**/*",
      "{projectRoot}/**/*.stories.@(js|jsx|ts|tsx|mdx)",
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
      "{projectRoot}/contentlayer.*.[jt]s?(x)",
      "{projectRoot}/bin/**/*",
      "{projectRoot}/tools/**/*",
      "{projectRoot}/helpers/**/*",
      "{projectRoot}/scripts/**/*"
    ]
  };

  /**
   * Dependencies between different target names across all projects
   *
   * @see https://nx.dev/reference/nx-json#target-defaults
   */
  public override targetDefaults: Nx.ITargetDefaults = {
    "lint-ls": {
      outputs: ["{projectRoot}/**/*"],
      inputs: ["linting", "default", "^production"],
      dependsOn: ["^lint-ls"],
      executor: "nx:run-commands",
      options: {
        command:
          'pnpm exec ls-lint --config="./node_modules/@storm-software/linting-tools/ls-lint/.ls-lint.yml" ',
        color: true
      }
    },
    "lint-sherif": {
      outputs: ["{projectRoot}/package.json"],
      inputs: ["{workspaceRoot}/package.json", "{projectRoot}/package.json"],
      executor: "nx:run-commands",
      options: {
        command: "pnpm exec sherif -i react -i react-dom -i typescript"
      }
    },
    "lint-knip": {
      inputs: ["linting", "default", "^production"],
      executor: "nx:run-commands",
      options: {
        command: "pnpm exec knip"
      }
    },
    lint: {
      outputs: ["{projectRoot}"],
      inputs: ["linting", "default", "^production"],
      dependsOn: ["lint-ls", "lint-sherif", "lint-knip", "lint-docs", "^lint"],
      executor: "nx:run-commands",
      options: {
        command: 'echo Linted the project files in "{projectRoot}" '
      }
    },
    "format-toml": {
      inputs: ["linting", "{projectRoot}/**/*.toml"],
      outputs: ["{projectRoot}/**/*.toml"],
      dependsOn: ["^format-toml"],
      executor: "nx:run-commands",
      options: {
        command:
          'pnpm exec taplo format --colors="always" --config="./node_modules/@storm-software/linting-tools/taplo/config.toml" --cache-path="./tmp/taplo/{projectRoot}"',
        color: true
      }
    },
    "format-readme": {
      inputs: [
        "linting",
        "documentation",
        "{projectRoot}/{README.md,package.json,Cargo.toml,executors.json,generators.json}",
        "default",
        "^production"
      ],
      outputs: ["{projectRoot}/README.md"],
      dependsOn: ["^format-readme"],
      executor: "nx:run-commands",
      options: {
        command:
          'pnpm exec storm-git readme-gen --templates="./tools/readme-templates" --project="{projectName}"',
        color: true
      }
    },
    "format-prettier": {
      inputs: ["linting", "default", "^production"],
      dependsOn: ["^format-prettier"],
      executor: "nx:run-commands",
      options: {
        command:
          'pnpm exec prettier "{projectRoot}/**/*" --write --ignore-unknown --no-error-on-unmatched-pattern --config="./node_modules/@storm-software/prettier/config.json" --ignore-path="./node_modules/@storm-software/prettier/.prettierignore" --cache --cache-location="./tmp/prettier/{projectRoot}" ',
        color: true
      }
    },
    format: {
      inputs: ["linting", "default", "^production"],
      outputs: ["{projectRoot}"],
      dependsOn: ["format-toml", "format-readme", "format-prettier", "^format"],
      executor: "nx:run-commands",
      options: {
        command: 'echo Formatted the project files in "{projectRoot}" '
      }
    },
    clean: {
      inputs: ["default", "^production"],
      outputs: NX_DEFAULT_BUILD_OUTPUTS,
      dependsOn: ["^clean"],
      executor: "nx:run-commands",
      options: {
        commands: [
          "pnpm exec rimraf --glob {projectRoot}/dist",
          "pnpm exec rimraf dist/{projectRoot}"
        ]
      }
    },
    "build-untyped": {
      dependsOn: ["^build"]
    },
    "build-base": {
      dependsOn: ["build-untyped", "^build"]
    },
    "build-local": {
      inputs: ["default", "^production"],
      dependsOn: ["build-base", "build-untyped", "^build"]
    },
    build: {
      inputs: ["default", "^production"],
      outputs: NX_DEFAULT_BUILD_OUTPUTS,
      dependsOn: ["build-base", "build-untyped", "^build"]
    },
    rebuild: {
      inputs: ["default", "^production"],
      executor: "nx:run-commands",
      dependsOn: ["clean", "^build"],
      options: {
        command: "pnpm exec nx run {projectName}:build",
        color: true,
        cwd: "{workspaceRoot}"
      }
    },
    docs: {
      outputs: ["{options.outputPath}"],
      inputs: ["linting", "documentation", "default", "^production"],
      dependsOn: ["build", "format-readme", "lint-docs", "^docs"]
    },
    test: {
      inputs: ["testing", "default", "^production"],
      dependsOn: ["build", "^test"]
    },
    e2e: {
      inputs: ["testing", "default", "^production"],
      dependsOn: ["test", "^e2e"]
    },
    "nx-release-publish": {
      inputs: ["default", "^production"],
      dependsOn: ["build", "^nx-release-publish"]
    }
  };

  /**
   * Configuration for Nx releases
   */
  public release: Obj<any> = {};

  /**
   * The number of parallel tasks to run.
   *
   * @defaultValue 5
   */
  public parallel = 5;

  /**
   * Should the daemon be used to run tasks?
   *
   * @defaultValue true
   */
  public useDaemonProcess = true;

  /**
   * Set this to false to disable adding inference plugins when generating new projects
   *
   * @defaultValue true
   */
  public useInferencePlugins = true;

  /**
   * The default base branch for new projects.
   *
   * @defaultValue "main"
   */
  public defaultBase = "main";

  /**
   * The CLI configuration for the workspace.
   */
  public cli: NxJsonConfiguration["cli"] | undefined;

  constructor(project: Project) {
    super(project);

    let StormWorkspaceConfig!: StormWorkspaceConfig;
    if (project.root.outdir) {
      const StormWorkspaceConfigJson = readFileSync(
        joinPaths(project.root.outdir, "storm-workspace.json"),
        "utf8"
      );
      StormWorkspaceConfig = JSON.parse(StormWorkspaceConfigJson);
    }

    if (StormWorkspaceConfig?.namespace) {
      this.npmScope = StormWorkspaceConfig?.namespace;
    }

    if (StormWorkspaceConfig?.branch) {
      this.defaultBase = StormWorkspaceConfig?.branch;
      this.affected = {
        defaultBase: StormWorkspaceConfig?.branch
      };
    }

    if (StormWorkspaceConfig?.packageManager) {
      this.cli = {
        packageManager: StormWorkspaceConfig?.packageManager
      };
    }

    this.nxJson = new JsonFile(project, "nx.json", {
      obj: {
        extends: () => this.extends,
        npmScope: () => this.npmScope,
        affected: () => asUndefinedIfEmpty(this.affected),
        workspaceLayout: () => asUndefinedIfEmpty(this.workspaceLayout),
        plugins: () => asUndefinedIfEmpty(this.nxPlugins),
        namedInputs: () => asUndefinedIfEmpty(this.namedInputs),
        targetDefaults: () => asUndefinedIfEmpty(this.targetDefaults),
        tasksRunnerOptions: () => asUndefinedIfEmpty(this.tasksRunnerOptions),
        parallel: () => this.parallel,
        useDaemonProcess: () => this.useDaemonProcess,
        useInferencePlugins: () => this.useInferencePlugins,
        release: () => asUndefinedIfEmpty(this.release)
      }
    });
  }

  /**
   * Adds a release group to the workspace.
   *
   * @param name The name of the release group
   * @param projects The projects in the release group
   * @param projectsRelationship The relationship between the projects
   * @param releaseTagPattern The release tag pattern
   * @param groupPreVersionCommand The command to run before versioning
   */
  public addReleaseGroup(
    name: string,
    projects: string[] | string,
    projectsRelationship: "fixed" | "independent" = "independent",
    releaseTagPattern = "{projectName}@{version}",
    groupPreVersionCommand = "pnpm build"
  ) {
    this.release ??= {
      groups: {},
      changelog: {
        entryWhenNoChanges: false,
        renderOptions: {
          authors: false,
          commitReferences: true,
          versionTitleDate: true
        }
      }
    };

    this.release.groups[name] = {
      projects,
      projectsRelationship,
      releaseTagPattern,
      version: {
        groupPreVersionCommand,
        currentVersionResolver: "git-tag",
        specifierSource: "conventional-commits",

        generator: "@storm-software/workspace-tools:release-version",
        generatorOptions: {
          currentVersionResolver: "git-tag",
          specifierSource: "conventional-commits"
        }
      }
    };
  }
}
