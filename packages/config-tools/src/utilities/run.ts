import type { StormWorkspaceConfig } from "@storm-software/config";
import { exec, execSync } from "node:child_process";

export const LARGE_BUFFER = 1024 * 1000000;
export type IOType = "overlapped" | "pipe" | "ignore" | "inherit";
export type StdioOptions =
  | IOType
  | Array<IOType | "ipc" | number | null | undefined>;

/**
 *  Run a command line process
 *
 * @remarks
 * A wrapper around `execSync` to run our command line processes
 *
 * @param config - The Storm configuration object
 * @param command - The command to run
 * @param cwd - The current working directory
 * @param stdio - The standard input/output options
 * @param env - The environment variables
 * @returns The result of the command
 */
export const run = (
  config: Partial<StormWorkspaceConfig>,
  command: string,
  cwd: string = config.workspaceRoot ?? process.cwd(),
  stdio: StdioOptions = "inherit",
  env: NodeJS.ProcessEnv = process.env
) => {
  return execSync(command, {
    cwd,
    env: {
      ...process.env,
      ...env,
      CLICOLOR: "true",
      FORCE_COLOR: "true"
    },
    windowsHide: true,
    stdio,
    maxBuffer: LARGE_BUFFER,
    killSignal: "SIGTERM",
    encoding: "utf8"
  });
};

/**
 *  Run an asynchronous command line process
 *
 * @remarks
 * A wrapper around `exec` to run our command line processes
 *
 * @param config - The Storm configuration object
 * @param command - The command to run
 * @param cwd - The current working directory
 * @param env - The environment variables
 * @returns A promise with the result of the command
 */
export const runAsync = (
  config: Partial<StormWorkspaceConfig>,
  command: string,
  cwd: string = config.workspaceRoot ?? process.cwd(),
  env: NodeJS.ProcessEnv = process.env
) => {
  return exec(command, {
    cwd,
    env: {
      ...process.env,
      ...env,
      CLICOLOR: "true",
      FORCE_COLOR: "true"
    },
    windowsHide: true,
    maxBuffer: LARGE_BUFFER,
    killSignal: "SIGTERM",
    encoding: "utf8"
  });
};
