import { ExecutorContext, joinPathFragments } from "@nx/devkit";
import type {
  CargoMetadata,
  Dependency,
  Package
} from "@storm-software/config-tools/utilities/toml";
import {
  type ChildProcess,
  execSync,
  spawn,
  type StdioOptions
} from "node:child_process";
import { relative } from "node:path";
import { CargoBaseExecutorSchema } from "../base/cargo-base-executor.schema.d";

interface CargoRun {
  success: boolean;
  output: string;
}

interface RunCargoOptions {
  stdio: StdioOptions;
  env: NodeJS.ProcessEnv | undefined;
}

export const INVALID_CARGO_ARGS = [
  "allFeatures",
  "allTargets",
  "main",
  "outputPath",
  "package",
  "tsConfig"
];

export let childProcess: ChildProcess | null;

export const buildCargoCommand = (
  baseCommand: string,
  options: CargoBaseExecutorSchema,
  context: ExecutorContext
): string[] => {
  const args = [] as string[];

  if (options.toolchain && options.toolchain !== "stable") {
    args.push(`+${options.toolchain}`);
  }

  args.push(baseCommand);

  for (const [key, value] of Object.entries(options)) {
    if (
      key === "toolchain" ||
      key === "release" ||
      INVALID_CARGO_ARGS.includes(key)
    ) {
      continue;
    }

    if (typeof value === "boolean") {
      // false flags should not be added to the cargo args
      if (value) {
        args.push(`--${key}`);
      }
    } else if (Array.isArray(value)) {
      for (const item of value) {
        args.push(`--${key}`, item);
      }
    } else {
      args.push(`--${key}`, String(value));
    }
  }

  if (context.projectName) {
    args.push("-p", context.projectName);
  }

  if (options.allFeatures && !args.includes("--all-features")) {
    args.push("--all-features");
  }

  if (options.allTargets && !args.includes("--all-targets")) {
    args.push("--all-targets");
  }

  if (options.release && !args.includes("--profile")) {
    args.push("--release");
  }

  if (options.outputPath && !args.includes("--target-dir")) {
    args.push("--target-dir", options.outputPath);
  }

  return args;
};

export async function cargoCommand(
  workspaceRoot: string,
  ...args: string[]
): Promise<{ success: boolean }> {
  console.log(`> cargo ${args.join(" ")}`);
  args.push("--color", "always");

  return await Promise.resolve(runProcess(workspaceRoot, "cargo", ...args));
}

export function cargoRunCommand(
  ...args: string[]
): Promise<{ success: boolean }> {
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

    childProcess.on("error", _err => {
      reject({ success: false });
    });

    childProcess.on("exit", code => {
      childProcess = null;
      if (code === 0) {
        resolve({ success: true });
      } else {
        reject({ success: false });
      }
    });
  });
}

export function cargoCommandSync(
  args = "",
  options?: Partial<RunCargoOptions>
): CargoRun {
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
    console.error("Failed to get cargo metadata");
    return null;
  }

  return JSON.parse(output.output) as CargoMetadata;
}

export function isExternal(
  packageOrDep: Package | Dependency,
  workspaceRoot: string
) {
  const isRegistry = packageOrDep.source?.startsWith("registry+") ?? false;
  const isGit = packageOrDep.source?.startsWith("git+") ?? false;
  const isOutsideWorkspace =
    "path" in packageOrDep &&
    relative(workspaceRoot, packageOrDep.path).startsWith("..");

  return isRegistry || isGit || isOutsideWorkspace;
}

export function runProcess(
  workspaceRoot: string,
  processCmd: string,
  ...args: string[]
): { success: boolean } | PromiseLike<{ success: boolean }> {
  const metadata = cargoMetadata();
  const targetDir =
    metadata?.target_directory ?? joinPathFragments(workspaceRoot, "dist");

  return new Promise(resolve => {
    if (process.env.VERCEL) {
      // Vercel doesn't have support for cargo atm, so auto success builds
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
