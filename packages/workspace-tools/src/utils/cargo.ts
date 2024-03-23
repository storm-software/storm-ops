import { relative } from "node:path";
import { type ChildProcess, execSync, spawn, type StdioOptions } from "node:child_process";
import type { CargoMetadata, Dependency, Package } from "./toml";
import { joinPathFragments, workspaceRoot } from "@nx/devkit";

interface CargoRun {
  success: boolean;
  output: string;
}

interface RunCargoOptions {
  stdio: StdioOptions;
  env: NodeJS.ProcessEnv | undefined;
}

export let childProcess: ChildProcess | null;

export async function cargoCommand(...args: string[]): Promise<{ success: boolean }> {
  console.log(`> cargo ${args.join(" ")}`);
  args.push("--color", "always");

  return await Promise.resolve(runProcess("cargo", ...args));
}

export function cargoRunCommand(...args: string[]): Promise<{ success: boolean }> {
  console.log(`> cargo ${args.join(" ")}`);
  return new Promise((resolve, reject) => {
    childProcess = spawn("cargo", [...args, "--color", "always"], {
      cwd: process.cwd(),
      windowsHide: true,
      detached: true,
      shell: false,
      stdio: ["inherit", "inherit", "inherit"]
    });

    // Ensure the child process is killed when the parent exits
    process.on("exit", () => childProcess?.kill());
    process.on("SIGTERM", () => childProcess?.kill());
    process.on("SIGINT", () => childProcess?.kill());

    childProcess.on("error", (_err) => {
      reject({ success: false });
    });

    childProcess.on("exit", (code) => {
      childProcess = null;
      if (code === 0) {
        resolve({ success: true });
      } else {
        reject({ success: false });
      }
    });
  });
}

export function cargoCommandSync(args = "", options?: Partial<RunCargoOptions>): CargoRun {
  const normalizedOptions: RunCargoOptions = {
    stdio: options?.stdio ?? "inherit",
    env: {
      ...process.env,
      ...options?.env
    }
  };

  try {
    return {
      output: execSync(`cargo ${args}`, {
        encoding: "utf8",
        windowsHide: true,
        stdio: normalizedOptions.stdio,
        env: normalizedOptions.env,
        maxBuffer: 1024 * 1024 * 10
      }),
      success: true
    };
  } catch (e) {
    return {
      output: e as string,
      success: false
    };
  }
}

export function cargoMetadata(): CargoMetadata | null {
  const output = cargoCommandSync("metadata --format-version=1", {
    stdio: "pipe"
  });

  if (!output.success) {
    return null;
  }

  return JSON.parse(output.output) as CargoMetadata;
}

export function isExternal(packageOrDep: Package | Dependency, workspaceRoot: string) {
  const isRegistry = packageOrDep.source?.startsWith("registry+") ?? false;
  const isGit = packageOrDep.source?.startsWith("git+") ?? false;
  const isOutsideWorkspace =
    "path" in packageOrDep && relative(workspaceRoot, packageOrDep.path).startsWith("..");

  return isRegistry || isGit || isOutsideWorkspace;
}

export function runProcess(
  processCmd: string,
  ...args: string[]
): { success: boolean } | PromiseLike<{ success: boolean }> {
  const metadata = cargoMetadata();
  const targetDir = metadata?.target_directory ?? joinPathFragments(workspaceRoot, "dist", "cargo");

  return new Promise((resolve) => {
    if (process.env.VERCEL) {
      // Vercel doesnt have support for cargo atm, so auto success builds
      return resolve({ success: true });
    }

    execSync(`${processCmd} ${args.join(" ")}`, {
      cwd: process.cwd(),
      env: {
        ...process.env,
        RUSTC_WRAPPER: "",
        CARGO_TARGET_DIR: targetDir,
        CARGO_BUILD_TARGET_DIR: targetDir
      },
      windowsHide: true,
      stdio: ["inherit", "inherit", "inherit"]
    });
    resolve({ success: true });
  });
}
