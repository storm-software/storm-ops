import type { StormConfig } from "../types";
import { execaCommandSync } from "execa";

export const LARGE_BUFFER = 1024 * 1000000;

/**
 *  Run a command line process
 *
 * @remarks
 * A wrapper around execa to run our command line processes
 *
 * @param config - The Storm configuration object
 * @param command - The command to run
 * @param cwd - The current working directory
 * @returns The result of the command
 */
export const run = (config: StormConfig, command: string, cwd: string = config.workspaceRoot) => {
  return execaCommandSync(command, {
    preferLocal: true,
    shell: true,
    cwd,
    env: {
      ...process.env,
      FORCE_COLOR: "true"
    },
    stdio: "inherit",
    maxBuffer: LARGE_BUFFER,
    killSignal: "SIGTERM"
  });
};
