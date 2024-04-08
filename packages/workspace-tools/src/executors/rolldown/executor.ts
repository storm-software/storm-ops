import type { ExecutorContext } from "@nx/devkit";
import type { StormConfig } from "@storm-software/config";
import { withRunExecutor } from "../../base/base-executor";
import { applyDefaultRolldownOptions } from "@storm-software/build-tools";
import type { RolldownExecutorSchema } from "./schema.d";
import { fork } from "child_process";

export async function rolldownExecutorFn(
  options: RolldownExecutorSchema,
  context: ExecutorContext,
  config?: StormConfig
) {
  const { writeDebug, writeInfo, writeSuccess } = await import(
    "@storm-software/config-tools"
  );

  writeInfo(config, "📦  Running Storm build executor on the workspace");

  // #region Apply default options

  writeDebug(
    config,
    `⚙️  Executor options:
${Object.keys(options)
  .map(
    key =>
      `${key}: ${
        !options[key] || _isPrimitive(options[key])
          ? options[key]
          : _isFunction(options[key])
            ? "<function>"
            : JSON.stringify(options[key])
      }`
  )
  .join("\n")}
`
  );

  // #endregion Apply default options

  // #region Prepare build context variables

  if (
    !context.projectsConfigurations?.projects ||
    !context.projectName ||
    !context.projectsConfigurations.projects[context.projectName]
  ) {
    throw new Error(
      "The Build process failed because the context is not valid. Please run this command from a workspace."
    );
  }

  // #endregion Prepare build context variables

  // biome-ignore lint/style/noNonNullAssertion: <explanation>
  // await rolldown(config!, {
  //   ...options,
  //   projectRoot:
  //   context.projectsConfigurations.projects?.[context.projectName]?.root,
  //   projectName: context.projectName,
  //   sourceRoot:
  //   context.projectsConfigurations.projects?.[context.projectName]?.sourceRoot
  // } as RolldownOptions);

  const buildBin = require.resolve("@storm-software/build-tools/bin/build");

  const args = [
    `--project-root=${context.projectsConfigurations.projects?.[context.projectName]?.root}`,
    `--project-name=${context.projectName}`,
    `--source-root=${context.projectsConfigurations.projects?.[context.projectName]?.sourceRoot}`
  ];
  if (options?.rolldownConfig) {
    args.push(`--config-path=${options?.rolldownConfig}`);
  }

  const proc = fork(buildBin, ["rolldown", ...args], {
    stdio: ["pipe", "pipe", "pipe", "ipc"],
    cwd: config?.workspaceRoot
  });
  proc.stdout?.on("data", message => {
    process.stdout.write(message);
  });
  proc.stderr?.on("data", message => {
    process.stderr.write(message);
  });

  await new Promise<void>((resolve, reject) => {
    proc.on("exit", code => {
      if (code !== 0) {
        reject(new Error(`Rolldown process exited with code ${code}`));
      } else {
        resolve();
      }
    });
  });

  // #endregion Run the build process

  writeSuccess(config, "⚡ The Build process has completed successfully");

  return {
    success: true
  };
}

export default withRunExecutor<RolldownExecutorSchema>(
  "TypeScript Build using Rolldown",
  rolldownExecutorFn,
  {
    skipReadingConfig: false,
    hooks: {
      applyDefaultOptions: applyDefaultRolldownOptions
    }
  }
);

const _isPrimitive = (value: unknown): boolean => {
  try {
    return (
      value === undefined ||
      value === null ||
      (typeof value !== "object" && typeof value !== "function")
    );
    // biome-ignore lint/correctness/noUnusedVariables: <explanation>
  } catch (e) {
    return false;
  }
};

const _isFunction = (
  value: unknown
): value is ((params?: unknown) => unknown) & ((param?: any) => any) => {
  try {
    return (
      value instanceof Function ||
      typeof value === "function" ||
      !!(value?.constructor && (value as any)?.call && (value as any)?.apply)
    );
    // biome-ignore lint/correctness/noUnusedVariables: <explanation>
  } catch (e) {
    return false;
  }
};
