import type { ExecutorContext } from "@nx/devkit";
import {
  getStopwatch,
  writeDebug,
  writeError,
  writeFatal,
  writeInfo,
  writeSuccess,
  writeTrace
} from "@storm-software/config-tools";
import type { StormConfig } from "@storm-software/config";
import {
  applyWorkspaceExecutorTokens,
  applyWorkspaceTokens
} from "../utils/apply-workspace-tokens";
import { getWorkspaceRoot } from "../utils/get-workspace-root";
import type {
  BaseExecutorOptions,
  BaseExecutorResult,
  BaseExecutorSchema
} from "../../declarations";
const { loadStormConfig } = require("@storm-software/config-tools/create-storm-config");

export const withRunExecutor =
  <TExecutorSchema extends BaseExecutorSchema = BaseExecutorSchema>(
    name: string,
    executorFn: (
      options: TExecutorSchema,
      context: ExecutorContext,
      config?: StormConfig
    ) => Promise<BaseExecutorResult | null | undefined> | BaseExecutorResult | null | undefined,
    executorOptions: BaseExecutorOptions<TExecutorSchema>
  ) =>
  async (_options: TExecutorSchema, context: ExecutorContext): Promise<{ success: boolean }> => {
    const stopwatch = getStopwatch(name);
    let options = _options;

    let config: StormConfig | undefined;
    try {
      writeInfo(config, `⚡ Running the ${name} executor...\n`);

      if (
        !context.projectsConfigurations?.projects ||
        !context.projectName ||
        !context.projectsConfigurations.projects[context.projectName]
      ) {
        throw new Error(
          "The Build process failed because the context is not valid. Please run this command from a workspace."
        );
      }

      const workspaceRoot = getWorkspaceRoot();
      const projectRoot = context.projectsConfigurations.projects[context.projectName].root;
      const sourceRoot = context.projectsConfigurations.projects[context.projectName].sourceRoot;
      const projectName = context.projectsConfigurations.projects[context.projectName].name;

      if (!executorOptions.skipReadingConfig) {
        writeDebug(
          config,
          `Loading the Storm Config from environment variables and storm.config.js file...
 - workspaceRoot: ${workspaceRoot}
 - projectRoot: ${projectRoot}
 - sourceRoot: ${sourceRoot}
 - projectName: ${projectName}\n`
        );

        config = await loadStormConfig(workspaceRoot);
        writeTrace(
          config,
          `Loaded Storm config into env: \n${Object.keys(process.env)
            .map(
              (key) =>
                ` - ${key}=${
                  _isFunction(process.env[key]) ? "<function>" : JSON.stringify(process.env[key])
                }`
            )
            .join("\n")}`
        );
      }

      if (executorOptions?.hooks?.applyDefaultOptions) {
        writeDebug(config, "Running the applyDefaultOptions hook...");
        options = await Promise.resolve(executorOptions.hooks.applyDefaultOptions(options, config));
        writeDebug(config, "Completed the applyDefaultOptions hook");
      }

      writeTrace(
        config,
        `Executor schema options ⚙️ \n${Object.keys(options)
          .map(
            (key) =>
              ` - ${key}=${_isFunction(options[key]) ? "<function>" : JSON.stringify(options[key])}`
          )
          .join("\n")}`
      );

      const tokenized = applyWorkspaceTokens(
        options,
        {
          config,
          workspaceRoot,
          projectRoot,
          sourceRoot,
          projectName,
          ...context.projectsConfigurations.projects[context.projectName],
          ...executorOptions
        },
        applyWorkspaceExecutorTokens
      ) as TExecutorSchema;

      if (executorOptions?.hooks?.preProcess) {
        writeDebug(config, "Running the preProcess hook...");
        await Promise.resolve(executorOptions.hooks.preProcess(tokenized, config));
        writeDebug(config, "Completed the preProcess hook");
      }

      const result = await Promise.resolve(executorFn(tokenized, context, config));
      if (
        result &&
        (!result.success ||
          (result.error &&
            (result?.error as Error)?.message &&
            typeof (result?.error as Error)?.message === "string" &&
            (result?.error as Error)?.name &&
            typeof (result?.error as Error)?.name === "string"))
      ) {
        throw new Error(`The ${name} executor failed to run`, {
          cause: result?.error
        });
      }

      if (executorOptions?.hooks?.postProcess) {
        writeDebug(config, "Running the postProcess hook...");
        await Promise.resolve(executorOptions.hooks.postProcess(config));
        writeDebug(config, "Completed the postProcess hook");
      }

      writeSuccess(config, `Completed running the ${name} task executor!\n`);

      return {
        success: true
      };
    } catch (error) {
      writeFatal(
        config,
        "A fatal error occurred while running the executor - the process was forced to terminate"
      );
      writeError(
        config,
        `An exception was thrown in the executor's process \n - Details: ${error.message}\n - Stacktrace: ${error.stack}`
      );

      return {
        success: false
      };
    } finally {
      stopwatch();
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
