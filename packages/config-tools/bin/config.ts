#!/usr/bin/env node

import {
  MultiThemeColorConfig,
  SingleThemeColorConfig
} from "@storm-software/config/types";
import chalk from "chalk";
import { Command, Option } from "commander";
import { getConfig } from "../src/get-config";
import {
  formatLogMessage,
  writeError,
  writeFatal,
  writeInfo,
  writeSuccess
} from "../src/logger/console";
import {
  exitWithError,
  exitWithSuccess,
  findWorkspaceRootSafe,
  handleProcess
} from "../src/utilities";

export function createProgram() {
  writeInfo("⚡ Running Storm Configuration Tools", { logLevel: "all" });

  const root = findWorkspaceRootSafe(process.cwd());
  process.env.STORM_WORKSPACE_ROOT ??= root;
  process.env.NX_WORKSPACE_ROOT_PATH ??= root;
  if (root) {
    process.chdir(root);
  }

  const program = new Command("storm-config");
  program.version("1.0.0", "-v --version", "display CLI version");

  const directory = new Option(
    "-d --dir <path>",
    "A directory that exists inside the workspace root"
  ).default(process.cwd());

  program
    .command("view", { isDefault: true })
    .description("View the current Storm configuration for the workspace.")
    .addOption(directory)
    .action(viewAction);

  return program;
}

export async function viewAction({ dir }: { dir: string }) {
  writeInfo(
    `🔍   Searching for Storm configuration for the workspace at "${dir}"...`,
    {
      logLevel: "all"
    }
  );

  const config = await getConfig(findWorkspaceRootSafe(dir), true);
  if (config) {
    writeSuccess(
      `The following Storm configuration values have been found for this repository:

${formatLogMessage({ ...config, colors: undefined })}

${typeof (config.colors as SingleThemeColorConfig).light === "string" ? formatSingleThemeColors(config.colors as SingleThemeColorConfig) : formatMultiThemeColors(config.colors as MultiThemeColorConfig)}
`,
      { ...config, logLevel: "all" }
    );
  } else {
    writeError(
      "No Storm config file found in the current workspace. Please ensure this is the expected behavior - you can add a `storm.json` file to the root of your workspace if it is not.\n",
      { logLevel: "all" }
    );
  }
}

void (async () => {
  try {
    handleProcess();

    const program = createProgram();
    await program.parseAsync(process.argv);

    exitWithSuccess();
  } catch (error) {
    writeFatal(
      `A fatal error occurred while running the Storm Git tool:
${error?.message ? error.message : JSON.stringify(error)}${
        error?.stack
          ? `
Stack Trace: ${error.stack}`
          : ""
      }`,
      { logLevel: "all" }
    );

    exitWithError();
    process.exit(1);
  }
})();

const formatSingleThemeColors = (config: SingleThemeColorConfig) => {
  return `---- Theme Colors ----
  ${Object.entries(config)
    .filter(([key, value]) => typeof value === "string" && value.length > 0)
    .map(([key, value]) => chalk.hex(value)(`${key}: ${chalk.bold(value)}`))
    .join(" \n")}
`;
};

const formatMultiThemeColors = (config: MultiThemeColorConfig) => {
  return ` ---- Light Theme Colors ----
${Object.entries(config.light)
  .filter(([key, value]) => typeof value === "string" && value.length > 0)
  .map(([key, value]) => chalk.hex(value)(`${key}: ${chalk.bold(value)}`))
  .join(" \n")}

---- Dark Theme Colors ----
${Object.entries(config.dark)
  .filter(([key, value]) => typeof value === "string" && value.length > 0)
  .map(([key, value]) => chalk.hex(value)(`${key}: ${chalk.bold(value)}`))
  .join(" \n")}
  `;
};
