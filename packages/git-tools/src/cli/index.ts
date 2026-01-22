import type { StormWorkspaceConfig } from "@storm-software/config";
import {
  brandIcon,
  findWorkspaceRootSafe,
  writeFatal,
  writeInfo,
  writeSuccess
} from "@storm-software/config-tools";
import { Command } from "commander";
import { runCommit } from "../commit/run";
import { runCommitLint } from "../commitlint/run";
import { runReadme } from "../readme/run";
import { runRelease } from "../release/run";
import type { CommitLintCLIOptions, ReadMeOptions } from "../types";

let _config: Partial<StormWorkspaceConfig> = {};

export function createProgram(config: StormWorkspaceConfig) {
  _config = config;
  writeInfo(`${brandIcon(_config)}  Running Storm Git Tools`, config);

  const root = findWorkspaceRootSafe(process.cwd());
  process.env.STORM_WORKSPACE_ROOT ??= root;
  process.env.NX_WORKSPACE_ROOT_PATH ??= root;
  if (root) {
    process.chdir(root);
  }

  const program = new Command("storm-git");
  program.version("1.0.0", "-v --version", "display CLI version");

  program
    .command("commit")
    .description("Commit changes to git for the workspace.")
    .option("--config <file>", "The Commitizen config file path")
    .option(
      "--dry-run",
      "Should the commit be run in dry-run mode (no updates are made)"
    )
    .action(commitAction);

  program
    .command("readme")
    .description("Run the README.md generator using the templates provided.")
    .option(
      "--templates <path>",
      "The templates directory to use when generating the README.md files.",
      "./tools/readme-templates"
    )
    .option(
      "--project <project>",
      "The specific project to generate a README.md file for"
    )
    .option("--output <path>", "Where to output the generated README.md file")
    .option(
      "--clean",
      "Should the output README.md file be cleaned before generation",
      true
    )
    .option(
      "--prettier",
      "Should the output README.md file have prettier applied to it",
      true
    )
    .action(readmeAction);

  program
    .command("release")
    .description("Run release for a project in the workspace.")
    .option("--project <project>", "The specific project to run release for")
    .option("--base <base>", "Git base tag value")
    .option("--head <head>", "Git head tag value")
    .option(
      "--dry-run",
      "Should the release be run in dry-run mode (no updates are made)"
    )
    .action(releaseAction);

  program
    .command("commitlint")
    .description("Run commitlint for the workspace's commit message.")
    .option("--config <file>", "The CommitLint config file path")
    .option("--message <commit-message>", "The commit message to lint")
    .option("--file <commit-file>", "The commit message to lint")
    .action(commitLintAction);

  return program;
}

export async function commitAction({
  config,
  dryRun = false
}: {
  config: string;
  dryRun: boolean;
}) {
  try {
    writeInfo(
      `${brandIcon(config)}  Preparing to commit your changes. Please provide the requested details below...`,
      _config
    );

    await runCommit(config, dryRun);

    writeSuccess(
      `🎉 Storm Commit processing completed successfully!

Note: Please run "pnpm push" to upload these changes to the remote ${
        _config.name
          ? _config.name
          : _config.namespace
            ? _config.namespace
            : _config.organization
              ? _config.organization
              : "Storm-Software"
      } Git repository at ${_config.repository}
`,
      _config
    );
  } catch (error) {
    writeFatal(
      `A fatal error occurred while running commit action: \n\n${
        error.message
      }${
        error.stack ? `\n\nStacktrace: ${error.stack}` : ""
      }\n\nPlease fix any errors and try committing again.`,
      _config
    );

    throw new Error(error.message, { cause: error });
  }
}

export async function readmeAction(options: ReadMeOptions) {
  try {
    writeInfo(
      `${brandIcon(_config)}  Formatting the workspace's README.md files`,
      _config
    );

    await runReadme(options);

    writeSuccess(
      "Formatting of the workspace's README.md files is complete\n",
      _config
    );
  } catch (error) {
    writeFatal(
      `A fatal error occurred while running README format action: \n\n${error.message}`
    );
    throw new Error(error.message, { cause: error });
  }
}

export async function releaseAction({
  project,
  base,
  head,
  dryRun
}: {
  project?: string;
  base?: string;
  head?: string;
  dryRun?: boolean;
}) {
  try {
    writeInfo(
      `${brandIcon(_config)}  Running the Storm Release and Publish process on the workspace`,
      _config
    );

    await runRelease(_config as StormWorkspaceConfig, {
      dryRun,
      project,
      base,
      head
    });

    writeSuccess("Release completed successfully!\n", _config);
  } catch (error) {
    writeFatal(
      `A fatal error occurred while running release action: \n\n${error.message} ${error.stack ? `\n\nStacktrace: ${error.stack}` : ""}`,
      _config
    );
    console.error(error);

    throw new Error(error.message, { cause: error });
  }
}

export async function commitLintAction(options: CommitLintCLIOptions) {
  try {
    writeInfo(
      `${brandIcon(_config)} Linting the ${
        _config.repository
          ? _config.repository
          : _config.namespace
            ? _config.namespace
            : _config.name
              ? _config.name
              : typeof _config.organization === "string"
                ? _config.organization
                : _config.organization?.name
                  ? _config.organization?.name
                  : "Storm-Software"
      } repository's commit messages.`,
      _config
    );

    await runCommitLint(_config as StormWorkspaceConfig, options);

    writeSuccess(
      "Linting the commit messages completed successfully!\n",
      _config
    );
  } catch (error) {
    writeFatal(
      `A fatal error occurred while linting the commit messages: \n\n${error.message}`,
      _config
    );
    throw new Error(error.message, { cause: error });
  }
}
