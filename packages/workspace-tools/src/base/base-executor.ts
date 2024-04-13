import type { ExecutorContext } from "@nx/devkit";
import type { StormConfig } from "@storm-software/config";
import { applyWorkspaceExecutorTokens } from "../utils/apply-workspace-tokens";
import type {
  BaseExecutorOptions,
  BaseExecutorResult,
  BaseExecutorSchema
} from "../../declarations";
import {
  applyWorkspaceTokens,
  type BaseTokenizerOptions
} from "@storm-software/config-tools";

export const withRunExecutor =
  <TExecutorSchema extends BaseExecutorSchema = BaseExecutorSchema>(
    name: string,
    executorFn: (
      options: TExecutorSchema,
      context: ExecutorContext,
      config?: StormConfig
    ) =>
      | Promise<BaseExecutorResult | null | undefined>
      | BaseExecutorResult
      | null
      | undefined,
    executorOptions: BaseExecutorOptions<TExecutorSchema>
  ) =>
  async (
    _options: TExecutorSchema,
    context: ExecutorContext
  ): Promise<{ success: boolean }> => {
    const {
      getStopwatch,
      writeDebug,
      writeError,
      writeFatal,
      writeInfo,
      writeSuccess,
      writeTrace,
      findWorkspaceRoot,
      loadStormConfig
    } = await import("@storm-software/config-tools");

    const stopwatch = getStopwatch(name);
    let options = _options;

    let config: StormConfig | undefined;
    try {
      writeInfo(`⚡ Running the ${name} executor...\n`, config);

      if (
        !context.projectsConfigurations?.projects ||
        !context.projectName ||
        !context.projectsConfigurations.projects[context.projectName]
      ) {
        throw new Error(
          "The Build process failed because the context is not valid. Please run this command from a workspace."
        );
      }

      const workspaceRoot = findWorkspaceRoot();
      const projectRoot =
        context.projectsConfigurations.projects[context.projectName]?.root ??
        workspaceRoot;
      const sourceRoot =
        context.projectsConfigurations.projects[context.projectName]
          ?.sourceRoot ?? workspaceRoot;
      const projectName =
        context.projectsConfigurations.projects[context.projectName]?.name ??
        context.projectName;

      // process.chdir(workspaceRoot);

      if (!executorOptions.skipReadingConfig) {
        writeDebug(
          `Loading the Storm Config from environment variables and storm.config.js file...
 - workspaceRoot: ${workspaceRoot}
 - projectRoot: ${projectRoot}
 - sourceRoot: ${sourceRoot}
 - projectName: ${projectName}\n`,
          config
        );

        config = await loadStormConfig(workspaceRoot);
        writeTrace(
          `Loaded Storm config into env: \n${Object.keys(process.env)
            .filter(key => key.startsWith("STORM_"))
            .map(
              key =>
                ` - ${key}=${
                  _isFunction(process.env[key])
                    ? "<function>"
                    : JSON.stringify(process.env[key])
                }`
            )
            .join("\n")}`,
          config
        );
      }

      if (executorOptions?.hooks?.applyDefaultOptions) {
        writeDebug("Running the applyDefaultOptions hook...", config);
        options = await Promise.resolve(
          executorOptions.hooks.applyDefaultOptions(options, config)
        );
        writeDebug("Completed the applyDefaultOptions hook", config);
      }

      writeTrace(
        `Executor schema options ⚙️ \n${Object.keys(options)
          .map(
            key =>
              ` - ${key}=${_isFunction(options[key]) ? "<function>" : JSON.stringify(options[key])}`
          )
          .join("\n")}`,
        config
      );

      const tokenized = (await applyWorkspaceTokens(
        options,
        {
          config,
          workspaceRoot,
          projectRoot,
          sourceRoot,
          projectName,
          ...context.projectsConfigurations.projects[context.projectName],
          ...executorOptions
        } as BaseTokenizerOptions,
        applyWorkspaceExecutorTokens
      )) as TExecutorSchema;

      if (executorOptions?.hooks?.preProcess) {
        writeDebug("Running the preProcess hook...", config);
        await Promise.resolve(
          executorOptions.hooks.preProcess(tokenized, config)
        );
        writeDebug("Completed the preProcess hook", config);
      }

      const result = await Promise.resolve(
        executorFn(tokenized, context, config)
      );
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
        writeDebug("Running the postProcess hook...", config);
        await Promise.resolve(executorOptions.hooks.postProcess(config));
        writeDebug("Completed the postProcess hook", config);
      }

      writeSuccess(`Completed running the ${name} task executor!\n`, config);

      return {
        success: true
      };
    } catch (error) {
      writeFatal(
        "A fatal error occurred while running the executor - the process was forced to terminate",
        config
      );
      writeError(
        `An exception was thrown in the executor's process \n - Details: ${error.message}\n - Stacktrace: ${error.stack}`,
        config
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
