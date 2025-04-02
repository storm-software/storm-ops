#!/usr/bin/env node

import type { StormWorkspaceConfig } from "@storm-software/config";
import { getConfig } from "@storm-software/config-tools/get-config";
import {
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
import { Command, Option } from "commander";
import type { ModuleFormat } from "rolldown";
import { build } from "../src/build";
import { clean } from "../src/clean";
import { TSDownCLIOptions } from "../src/types";

async function createProgram(config: StormWorkspaceConfig) {
  try {
    writeInfo("⚡ Running Storm TSDown pipeline", config);

    const root = findWorkspaceRootSafe();
    process.env.STORM_WORKSPACE_ROOT ??= root;
    process.env.NX_WORKSPACE_ROOT_PATH ??= root;
    if (root) {
      process.chdir(root);
    }

    const program = new Command("storm-tsdown");
    program.version("1.0.0", "-v --version", "display CLI version");

    program
      .description("⚡ Run the Storm TSDown pipeline")
      .showHelpAfterError()
      .showSuggestionAfterError();

    const projectRootOption = new Option(
      "-p --project-root <path>",
      "The path to the root of the project to build. This path is defined relative to the workspace root."
    ).makeOptionMandatory(true);

    const sourceRootOption = new Option(
      "-s --source-root <path>",
      "The path of the project's source folder to build"
    );

    const nameOption = new Option(
      "-n --name <value>",
      "The name of the project to build"
    );

    const outputPathOption = new Option(
      "-o --output-path <path>",
      "The path of the project's source folder to build"
    ).default("dist/{projectRoot}");

    const platformOption = new Option(
      "-p --platform <value>",
      "The platform to build the distribution for"
    )
      .choices(["node", "neutral", "browser"])
      .default("node");

    const formatOption = new Option(
      "-f, --format <value...>",
      "The format to build the distribution in"
    )
      .choices(["esm", "cjs", "iife"])
      .argParser<string[]>((value: string, previous: string[]) => {
        if (previous === undefined) {
          return [value];
        } else if (!previous.includes(value)) {
          previous.push(value);
        }

        return previous;
      })
      .default("esm");

    const cleanOption = new Option(
      "-c --clean",
      "Should the output directory be cleaned before building"
    ).default(true);

    const noCleanOption = new Option(
      "--no-clean",
      "Should the output directory be cleaned before building"
    ).default(false);

    const bundleOption = new Option(
      "-b --bundle",
      "Should the output be bundled"
    ).default(true);

    const noBundleOption = new Option(
      "--no-bundle",
      "Should the output be bundled"
    ).default(false);

    const targetOption = new Option(
      "-t --target <value>",
      "The target to build the distribution for"
    )
      .choices([
        "ESNext",
        "ES2015",
        "ES2016",
        "ES2017",
        "ES2018",
        "ES2019",
        "ES2020",
        "ES2021",
        "ES2022",
        "ES2023"
      ])
      .default("ESNext");

    const watchOption = new Option(
      "-w --watch",
      "Should the build process watch for changes"
    ).default(false);

    const debugOption = new Option(
      "-d --debug",
      "Should the build process run in debug mode"
    ).default(false);

    const bannerOption = new Option(
      "--banner <value>",
      "The banner to prepend to the output"
    );

    const footerOption = new Option(
      "--footer <value>",
      "The footer to prepend to the output"
    );

    const splittingOption = new Option(
      "--splitting",
      "Should the output be split into multiple files"
    ).default(true);

    const treeShakingOption = new Option(
      "--tree-shaking",
      "Should tree shaking be enabled"
    ).default(true);

    const generatePackageJsonOption = new Option(
      "--generate-package-json",
      "Should a package.json be generated for the output"
    ).default(true);

    const emitOnAllOption = new Option(
      "--emit-on-all",
      "Should the output be emitted on all platforms"
    ).default(false);

    const metafileOption = new Option(
      "--metafile",
      "Should a metafile be generated for the output"
    ).default(true);

    const minifyOption = new Option(
      "--minify",
      "Should the output be minified"
    ).default(true);

    const includeSrcOption = new Option(
      "--include-src",
      "Should the source files be included in the output"
    ).default(false);

    const verboseOption = new Option(
      "--verbose",
      "Should the build process be verbose"
    ).default(false);

    const injectShimsOption = new Option(
      "--inject-shims",
      "Should shims be injected into the output"
    ).default(true);

    const emitTypesOption = new Option(
      "--emit-types",
      "Should types be emitted for the output"
    ).default(true);

    program
      .command("build", { isDefault: true })
      .alias("bundle")
      .description(
        "Run a TypeScript build using TSDown, API-Extractor, and TSC (for type generation)."
      )
      .addOption(nameOption)
      .addOption(projectRootOption)
      .addOption(sourceRootOption)
      .addOption(outputPathOption)
      .addOption(platformOption)
      .addOption(formatOption)
      .addOption(targetOption)
      .addOption(bundleOption)
      .addOption(noBundleOption)
      .addOption(cleanOption)
      .addOption(noCleanOption)
      .addOption(watchOption)
      .addOption(debugOption)
      .addOption(bannerOption)
      .addOption(footerOption)
      .addOption(splittingOption)
      .addOption(treeShakingOption)
      .addOption(generatePackageJsonOption)
      .addOption(emitOnAllOption)
      .addOption(metafileOption)
      .addOption(minifyOption)
      .addOption(includeSrcOption)
      .addOption(verboseOption)
      .addOption(injectShimsOption)
      .addOption(emitTypesOption)
      .action(buildAction(config));

    program
      .command("clean")
      .alias("clear")
      .description(
        "Clean the output directory of the project. This command will remove the 'dist' folder."
      )
      .addOption(nameOption)
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
        ...options,
        format: options.format as ModuleFormat
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
      `🎉  Storm TSDown executable has completed successfully!`,
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
