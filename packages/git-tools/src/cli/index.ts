import {
  findWorkspaceRootSafe,
  exitWithError,
  writeFatal,
  writeInfo,
  writeSuccess
} from "@storm-software/config-tools";
import type { StormConfig } from "@storm-software/config";
import { runCommit } from "../commit";
import { runReadme } from "../readme";
import { runRelease } from "../release";
import type { ReadMeOptions } from "../types";
import { Command, Option } from "commander";

let _config: Partial<StormConfig> = {};

export function createProgram(config: StormConfig) {
  try {
    _config = config;
    writeInfo("⚡ Running Storm Git Tools", config);

    // const commander = await import("commander");

    const root = findWorkspaceRootSafe(process.cwd());
    process.env.STORM_WORKSPACE_ROOT ??= root;
    process.env.NX_WORKSPACE_ROOT_PATH ??= root;
    root && process.chdir(root);

    const program = new Command("storm-git");
    program.version("1.0.0", "-v --version", "display CLI version");

    const commitlintConfig = new Option(
      "--config <file>",
      "Commitlint/Commitizen config file path"
    ).default("@storm-software/git-tools/src/commit/config.js");

    const commitlintDryRun = new Option(
      "--dry-run",
      "Should the commit be run in dry-run mode (no updates are made)"
    );

    program
      .command("commit")
      .description("Run commitlint and commitizen for the workspace.")
      .addOption(commitlintConfig)
      .addOption(commitlintDryRun)
      .action(commitAction);

    const readmeTemplatePath = new Option(
      "--templates <path>",
      "The templates directory to use when generating the README.md files."
    ).default("./docs/readme-templates");

    const readmePackageName = new Option(
      "--project <project>",
      "The specific project to generate a README.md file for"
    );

    const readmeOutput = new Option(
      "--output <path>",
      "Where to output the generated README.md file"
    );

    const readmeClean = new Option(
      "--clean",
      "Should the output README.md file be cleaned before generation"
    ).default(true);

    const readmePrettier = new Option(
      "--prettier",
      "Should the output README.md file have prettier applied to it"
    ).default(true);

    program
      .command("readme-gen")
      .description("Run the README.md generator using the templates provided.")
      .addOption(readmeTemplatePath)
      .addOption(readmePackageName)
      .addOption(readmeOutput)
      .addOption(readmeClean)
      .addOption(readmePrettier)
      .action(readmeAction);

    const releasePackageName = new Option(
      "--project <project>",
      "The specific project to run release for"
    );

    const releaseBase = new Option("--base <base>", "Git base tag value");
    const releaseHead = new Option("--head <head>", "Git head tag value");

    const releaseDryRun = new Option(
      "--dry-run",
      "Should the release be run in dry-run mode (no updates are made)"
    );

    program
      .command("release")
      .description("Run release for a project in the workspace.")
      .addOption(releasePackageName)
      .addOption(releaseBase)
      .addOption(releaseHead)
      .addOption(releaseDryRun)
      .action(releaseAction);

    return program;
  } catch (error) {
    writeFatal(
      `A fatal error occurred while running the program: ${error.message}`,
      config
    );
    exitWithError(config);
    process.exit(1);
  }
}

export async function commitAction({
  config = "@storm-software/git-tools/src/commit/config.js",
  dryRun = false
}: {
  config: string;
  dryRun: boolean;
}) {
  try {
    writeInfo(
      `⚡ Preparing to commit your changes to the ${
        _config.repository
          ? _config.repository
          : _config.namespace
            ? _config.namespace
            : _config.name
              ? _config.name
              : _config.organization
                ? _config.organization
                : "Storm-Software"
      } Git repository. Please provide the requested details below...`,
      _config
    );
    await runCommit(config, dryRun);
    writeSuccess(
      "Commit linting completed successfully! Changes can be uploaded to Git. \n",
      _config
    );
  } catch (error) {
    writeFatal(
      `A fatal error occurred while running commit action: ${error.message}`,
      _config
    );
    exitWithError(_config);
  }
}

export async function readmeAction(options: ReadMeOptions) {
  try {
    writeInfo("⚡ Formatting the workspace's README.md files", _config);
    await runReadme(options);
    writeSuccess(
      "Formatting of the workspace's README.md files is complete\n",
      _config
    );
  } catch (error) {
    writeFatal(
      `A fatal error occurred while running README format action: ${error.message}`
    );
    exitWithError(_config);
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
      "⚡ Running the Storm Release and Publish process on the workspace",
      _config
    );
    await runRelease(_config as StormConfig, { dryRun, project, base, head });
    writeSuccess("Release completed successfully!\n", _config);
  } catch (error) {
    writeFatal(
      `A fatal error occurred while running release action: ${error.message}`,
      _config
    );
    exitWithError(_config);
  }
}
