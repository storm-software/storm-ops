import {
  type StormConfig,
  exitWithError,
  writeFatal,
  writeInfo,
  writeSuccess
} from "@storm-software/config-tools";
import { findWorkspaceRoot } from "nx/src/utils/find-workspace-root.js";
import { runCommit } from "../commit";
import { runReadme } from "../readme";
import { runRelease } from "../release";
import type { ReadMeOptions } from "../types";

let _config: Partial<StormConfig> = {};

export async function createProgram(config: StormConfig) {
  try {
    _config = config;
    writeInfo(config, "⚡ Running Storm Git Tools");

    const { Command, Option } = await import("commander");

    const root = findWorkspaceRoot(process.cwd());
    process.env.STORM_WORKSPACE_ROOT ??= root?.dir;
    process.env.NX_WORKSPACE_ROOT_PATH ??= root?.dir;
    root?.dir && process.chdir(root.dir);

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
    writeFatal(config, `A fatal error occurred while running the program: ${error.message}`);
    exitWithError(config);

    return null;
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
    writeInfo(_config, "⚡ Linting the Commit Message and running Commitizen \n");
    await runCommit(config, dryRun);
    writeSuccess(
      _config,
      "Commit linting completed successfully! Changes can be uploaded to Git. \n"
    );
  } catch (error) {
    writeFatal(_config, `A fatal error occurred while running commit action: ${error.message}`);
    exitWithError(_config);
  }
}

export async function readmeAction(options: ReadMeOptions) {
  try {
    writeInfo(_config, "⚡ Formatting the workspace's README.md files \n");
    await runReadme(options);
    writeSuccess(_config, "Formatting of the workspace's README.md files is complete\n");
  } catch (error) {
    writeFatal(
      _config,
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
    writeInfo(_config, "⚡ Linting the Commit Message and running Commitizen \n");
    await runRelease(_config, { dryRun, project, base, head });
    writeSuccess(_config, "Release completed successfully!\n");
  } catch (error) {
    writeFatal(_config, `A fatal error occurred while running release action: ${error.message}`);
    exitWithError(_config);
  }
}
