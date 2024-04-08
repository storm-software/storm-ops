import type { StormConfig } from "@storm-software/config";
import { execSync } from "node:child_process";

export const LARGE_BUFFER = 1024 * 1000000;
export type IOType = "overlapped" | "pipe" | "ignore" | "inherit";
export type StdioOptions =
  | IOType
  | Array<IOType | "ipc" | number | null | undefined>;

/**
 *  Run a command line process
 *
 * @remarks
 * A wrapper around execSync to run our command line processes
 *
 * @param config - The Storm configuration object
 * @param command - The command to run
 * @param cwd - The current working directory
 * @returns The result of the command
 */
export const run = (
  config: StormConfig,
  command: string,
  cwd: string = config.workspaceRoot ?? process.cwd(),
  stdio: StdioOptions = "inherit"
) => {
  return execSync(command, {
    cwd,
    env: {
      ...process.env,
      FORCE_COLOR: "true"
    },
    stdio,
    maxBuffer: LARGE_BUFFER,
    killSignal: "SIGTERM"
  });
};
