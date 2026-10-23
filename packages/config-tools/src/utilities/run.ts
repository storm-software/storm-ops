import type { StormWorkspaceConfig } from "@storm-software/config";
import { exec, execSync, type ChildProcess } from "node:child_process";

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
 * @returns The child process. It is thenable and settles when the process exits.
 */
export const runAsync = (
  config: Partial<StormWorkspaceConfig>,
  command: string,
  cwd: string = config.workspaceRoot ?? process.cwd(),
  env: NodeJS.ProcessEnv = process.env
) => {
  const child = exec(command, {
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
  child.stdout?.pipe(process.stdout);
  child.stderr?.pipe(process.stderr);

  const done = new Promise<void>((resolve, reject) => {
    child.once("error", reject);
    child.once("close", code => {
      if (code === 0) {
        resolve();
        return;
      }
      reject(
        new Error(`Command failed with exit code ${code ?? "null"}: ${command}`)
      );
    });
  });

  // ponytail: ChildProcess is not thenable, so await returned at spawn. Callers wait for exit.
  return Object.assign(child, {
    then: done.then.bind(done),
    catch: done.catch.bind(done),
    finally: done.finally.bind(done)
  }) as ChildProcess & PromiseLike<void>;
};
