import {
  prepareWorkspace,
  writeFatal,
  writeInfo,
  writeSuccess
} from "@storm-software/config-tools";
import { findWorkspaceRoot } from "nx/src/utils/find-workspace-root.js";
import { runCommit } from "../commit";
import { runReadme } from "../readme";
import { runRelease } from "../release";
import type { ReadMeOptions } from "../types";

const _STORM_CONFIG = await prepareWorkspace();

export async function createProgram() {
  try {
    writeInfo(_STORM_CONFIG, "⚡ Running Storm Git Tools");

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
    ).default("@storm-software/git-tools/commit/config.js");

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
    ).default("@storm-software/git-tools/readme/templates");

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

    const releaseConfig = new Option("--config <file>", "Release config file path").default(
      "@storm-software/git-tools/release/config.js"
    );

    const releasePackageName = new Option(
      "--project <project>",
      "The specific project to run release for"
    );

    const releasePlugin = new Option("--plugin <plugin>", "Semantic Release plugin").default(
      "@storm-software/git-tools/semantic-release-plugin"
    );

    const releaseBase = new Option("--base <base>", "Git base tag value");
    const releaseHead = new Option("--head <head>", "Git head tag value");

    program
      .command("release")
      .description("Run release for a project in the workspace.")
      .addOption(releasePackageName)
      .addOption(releaseConfig)
      .addOption(releasePlugin)
      .addOption(releaseBase)
      .addOption(releaseHead)
      .action(releaseAction);

    return program;
  } catch (e) {
    writeFatal(_STORM_CONFIG, `A fatal error occurred while running the program: ${e.message}`);
    process.exit(1);
  }
}

export async function commitAction({
  config = "@storm-software/git-tools/commit/config.js",
  dryRun = false
}: {
  config: string;
  dryRun: boolean;
}) {
  try {
    writeInfo(_STORM_CONFIG, "⚡ Linting the Commit Message and running Commitizen \n");
    await runCommit(config, dryRun);
    writeSuccess(
      _STORM_CONFIG,
      "\nCommit linting completed successfully! Changes can be uploaded to Git. \n"
    );

    process.exit(0);
  } catch (e) {
    writeFatal(_STORM_CONFIG, `A fatal error occurred while running commit action: ${e.message}`);
    process.exit(1);
  }
}

export async function readmeAction(options: ReadMeOptions) {
  try {
    writeInfo(_STORM_CONFIG, "⚡ Formatting the workspace's README.md files \n");
    await runReadme(options);
    writeSuccess(_STORM_CONFIG, "\nFormatting of the workspace's README.md files is complete\n");

    process.exit(0);
  } catch (e) {
    writeFatal(
      _STORM_CONFIG,
      `A fatal error occurred while running README format action: ${e.message}`
    );
    process.exit(1);
  }
}

export async function releaseAction({
  project,
  config = "@storm-software/git-tools/commit/config.js",
  plugin = "@storm-software/git-tools/semantic-release-plugin",
  base,
  head
}: {
  plugin: string;
  config: string;
  project?: string;
  base?: string;
  head?: string;
}) {
  try {
    writeInfo(_STORM_CONFIG, "⚡ Linting the Commit Message and running Commitizen \n");
    await runRelease(project, config, plugin, base, head);
    writeSuccess(_STORM_CONFIG, "\n Release completed successfully!\n");

    process.exit(0);
  } catch (e) {
    writeFatal(_STORM_CONFIG, `A fatal error occurred while running release action: ${e.message}`);
    process.exit(1);
  }
}
