#!/usr/bin/env node

import type { StormConfig } from "@storm-software/config";
import { loadStormConfig } from "@storm-software/config-tools/create-storm-config";
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
import { getGenerateAction } from "../src/generate";

async function createProgram(config: StormConfig) {
  try {
    writeInfo("⚡ Running Storm Untyped codegen utility", config);

    const root = findWorkspaceRootSafe();
    process.env.STORM_WORKSPACE_ROOT ??= root;
    process.env.NX_WORKSPACE_ROOT_PATH ??= root;
    root && process.chdir(root);

    const program = new Command("storm-untyped");
    program.version("1.0.0", "-v --version", "display CLI version");

    program
      .description("⚡ Run the Storm untyped codegen utility")
      .showHelpAfterError()
      .showSuggestionAfterError();

    const entryOption = new Option(
      "-e --entry <path>",
      "The path to the entry file to generate types for. This can be a file or a directory. Globs are supported."
    )
      .argParser(val => val.split(","))
      .default(["**/untyped.ts", "**/*.untyped.ts"]);

    const outputPathOption = new Option(
      "-o --output-path <path>",
      "The path of the project's source folder to build"
    );

    program
      .command("generate", { isDefault: true })
      .alias("bundle")
      .description(
        "Run a TypeScript build using Untyped, API-Extractor, and TSC (for type generation)."
      )
      .addOption(entryOption)
      .addOption(outputPathOption)
      .action(getGenerateAction(config));

    return program;
  } catch (e) {
    writeFatal(
      `A fatal error occurred while running the program: ${e.message}`,
      config
    );
    process.exit(1);
  }
}

void (async () => {
  const config = await loadStormConfig();
  const stopwatch = getStopwatch("Storm Untyped executable");

  try {
    handleProcess(config);

    const program = await createProgram(config);
    await program.parseAsync(process.argv);

    writeSuccess(
      `🎉  Storm Untyped executable has completed successfully!`,
      config
    );
    exitWithSuccess(config);
  } catch (error) {
    writeFatal(
      `A fatal error occurred while running Storm Untyped executable: \n\n${error.message}`,
      config
    );
    exitWithError(config);
    process.exit(1);
  } finally {
    stopwatch();
  }
})();
