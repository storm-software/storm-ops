#!/usr/bin/env node

import type { StormWorkspaceConfig } from "@storm-software/config";
import { getConfig } from "@storm-software/config-tools/get-config";
import {
  brandIcon,
  getStopwatch,
  writeFatal,
  writeInfo,
  writeSuccess
} from "@storm-software/config-tools/logger/console";
import { findWorkspaceRootSafe } from "@storm-software/config-tools/utilities/find-workspace-root";
import {
  exitWithError,
  exitWithSuccess,
  handleProcess
} from "@storm-software/config-tools/utilities/process-handler";
import { Command } from "commander";
import { build } from "../src/build";
import { clean } from "../src/clean";
import { TSDownCLIOptions } from "../src/types";

async function createProgram(config: StormWorkspaceConfig) {
  try {
    writeInfo(`${brandIcon(config)}  Running Storm TSDown pipeline`, config);

    const root = findWorkspaceRootSafe();
    process.env.STORM_WORKSPACE_ROOT ??= root;
    process.env.NX_WORKSPACE_ROOT_PATH ??= root;
    if (root) {
      process.chdir(root);
    }

    const program = new Command("storm-tsdown");
    program.version("1.0.0", "-v --version", "display CLI version");

    program
      .description("Run the Storm TSDown pipeline")
      .showHelpAfterError()
      .showSuggestionAfterError();

    program
      .command("build", { isDefault: true })
      .alias("bundle")
      .description(
        "Run a TypeScript build using ESBuild, API-Extractor, and TSC (for type generation)."
      )
      .option("-n --name <value>", "The name of the project to build")
      .option(
        "-p --project-root <path>",
        "The path to the root of the project to build. This path is defined relative to the workspace root."
      )
      .option(
        "-s --source-root <path>",
        "The path of the project's source folder to build"
      )
      .option(
        "-o --output-path <path>",
        "The path of the project's source folder to build",
        "dist/{projectRoot}"
      )
      .option(
        "-p --platform <value>",
        "The platform to build the distribution for",
        "node"
      )
      .option(
        "-f, --format <value...>",
        "The format to build the distribution in",

        (value: string, previous: unknown) => {
          if (previous === undefined) {
            return [value];
          } else if (Array.isArray(previous) && !previous.includes(value)) {
            previous.push(value);
          }

          return previous;
        },
        ["esm"]
      )
      .option(
        "-t --target <value>",
        "The target to build the distribution for",
        "ESNext"
      )
      .option("-b --bundle", "Should the output be bundled", true)
      .option("--no-bundle", "Should the output be bundled")
      .option(
        "-c --clean",
        "Should the output directory be cleaned before building",
        true
      )
      .option(
        "--no-clean",
        "Should the output directory be cleaned before building"
      )
      .option("-w --watch", "Should the build process watch for changes")
      .option(
        "-m --mode",
        "What mode should the build process run in",
        "production"
      )
      .option("--banner <value>", "The banner to prepend to the output")
      .option("--footer <value>", "The footer to prepend to the output")
      .option(
        "--splitting",
        "Should the output be split into multiple files",
        true
      )
      .option("--treeshake", "Should tree shaking be enabled", true)
      .option(
        "--generate-package-json",
        "Should a package.json be generated for the output",
        true
      )
      .option(
        "--metafile",
        "Should a metafile be generated for the output",
        true
      )
      .option("--minify", "Should the output be minified", true)
      .option(
        "--include-src",
        "Should the source files be included in the output",
        false
      )
      .option("--shims", "Should shims be injected into the output", true)
      .option(
        "--dts",
        "Should typescript type declarations be emitted for the output",
        true
      )
      .action(buildAction(config));

    program
      .command("clean")
      .alias("clear")
      .description(
        "Clean the output directory of the project. This command will remove the 'dist' folder."
      )
      .option("-n --name <value>", "The name of the project to build")
      .action(cleanAction(config));

    return program;
  } catch (e) {
    writeFatal(
      `A fatal error occurred while running the program: ${e.message}`,
      config
    );
    process.exit(1);
  }
}

const buildAction =
  (config: StormWorkspaceConfig) => async (options: TSDownCLIOptions) => {
    try {
      await build({
        ...options
      });
    } catch (e) {
      writeFatal(
        `A fatal error occurred while cleaning the TSDown output directory: ${e.message}`,
        config
      );

      exitWithError(config);
      process.exit(1);
    }
  };

const cleanAction =
  (config: StormWorkspaceConfig) =>
  async (options: { output: string; name?: string }) => {
    try {
      await clean(options.name, options.output, config);
    } catch (e) {
      writeFatal(
        `A fatal error occurred while cleaning the TSDown output directory: ${e.message}`,
        config
      );

      exitWithError(config);
      process.exit(1);
    }
  };

void (async () => {
  const config = await getConfig();
  const stopwatch = getStopwatch("Storm TSDown executable");

  try {
    handleProcess(config);

    const program = await createProgram(config);
    await program.parseAsync(process.argv);

    writeSuccess(
      `✔  Storm TSDown executable has completed successfully!`,
      config
    );
    exitWithSuccess(config);
  } catch (error) {
    writeFatal(
      `A fatal error occurred while running Storm TSDown executable: \n\n${error.message}`,
      config
    );
    exitWithError(config);
    process.exit(1);
  } finally {
    stopwatch();
  }
})();
