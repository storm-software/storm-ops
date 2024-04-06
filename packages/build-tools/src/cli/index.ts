import {
  findWorkspaceRootSafe,
  writeFatal,
  writeInfo,
  writeSuccess
} from "@storm-software/config-tools";
import type { StormConfig } from "@storm-software/config";
import { build, rolldown } from "../build";
import { applyDefaultOptions, applyDefaultRolldownOptions } from "../utils";

export async function createProgram(config: StormConfig) {
  const { Command, Option } = await import("commander");

  try {
    writeInfo(config, "⚡ Running Storm Build Tools");

    const root = findWorkspaceRootSafe();
    process.env.STORM_WORKSPACE_ROOT ??= root;
    process.env.NX_WORKSPACE_ROOT_PATH ??= root;
    root && process.chdir(root);

    const program = new Command("storm-build");
    program.version("1.0.0", "-v --version", "display CLI version");

    program
      .description("⚡ Build the Storm Workspace code")
      .showHelpAfterError()
      .showSuggestionAfterError();

    const projectRootOption = new Option(
      "--project-root <args>",
      "The path to the root of the project to build. This path is defined relative to the workspace root."
    );

    const projectNameOption = new Option(
      "--project-name <args>",
      "The name of the project to build"
    );

    const sourceRootOption = new Option(
      "--source-root <args>",
      "The path of the project's source folder to build"
    );

    program
      .command("typescript")
      .alias("ts")
      .description(
        "Run a TypeScript build using ESBuild, API-Extractor, and TSC (for type generation)."
      )
      .addOption(projectNameOption)
      .addOption(projectRootOption)
      .addOption(sourceRootOption)
      .action(tsBuildAction(config));

    const configPathOption = new Option(
      "--config-path <file>",
      "The path of a Rolldown configuration file to use for the build"
    );

    program
      .command("rolldown")
      .description(
        "Run a TypeScript build using [Rolldown](https://rolldown.rs/), a Rollup-based bundler written in Rust."
      )
      .addOption(projectNameOption)
      .addOption(projectRootOption)
      .addOption(sourceRootOption)
      .addOption(configPathOption)
      .action(rolldownAction(config));

    return program;
  } catch (e) {
    writeFatal(config, `A fatal error occurred while running the program: ${e.message}`);
    process.exit(1);
  }
}

const tsBuildAction =
  (config: StormConfig) =>
  async (projectRoot?: string, projectName?: string, sourceRoot?: string) => {
    try {
      writeInfo(config, "⚡ Building the Storm TypeScript package");
      await build(config, applyDefaultOptions({ projectRoot, projectName, sourceRoot }, config));

      writeSuccess(config, "Building has completed successfully ✅");
    } catch (e) {
      writeFatal(config, `❌ A fatal error occurred while building the package: ${e.message}`);
      console.error(e);

      process.exit(1);
    }
  };

const rolldownAction =
  (config: StormConfig) =>
  async (projectRoot?: string, projectName?: string, sourceRoot?: string, configPath?: string) => {
    try {
      writeInfo(config, "⚡ Building the Storm TypeScript package with Rolldown");
      await rolldown(
        config,
        applyDefaultRolldownOptions(
          {
            projectRoot,
            projectName,
            sourceRoot,
            rolldownConfig: configPath
          },
          config
        )
      );

      writeSuccess(config, "Rolldown has completed successfully ✅");
    } catch (e) {
      writeFatal(config, `❌ A fatal error occurred while running Rolldown: ${e.message}`);
      console.error(e);

      process.exit(1);
    }
  };
