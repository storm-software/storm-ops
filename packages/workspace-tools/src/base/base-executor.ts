import type { ExecutorContext, PromiseExecutor } from "@nx/devkit";
import type { StormWorkspaceConfig } from "@storm-software/config";
import {
  applyWorkspaceProjectTokens,
  applyWorkspaceTokens,
  findWorkspaceRoot,
  formatLogMessage,
  getConfig,
  getStopwatch,
  ProjectTokenizerOptions,
  writeDebug,
  writeError,
  writeFatal,
  writeInfo,
  writeSuccess,
  writeTrace
} from "@storm-software/config-tools";
import { defu } from "defu";
import { BaseExecutorOptions, BaseExecutorResult } from "../types";
import { BaseExecutorSchema } from "./base-executor.schema.d";

export const withRunExecutor =
  <TExecutorSchema extends BaseExecutorSchema = BaseExecutorSchema>(
    name: string,
    executorFn: (
      options: TExecutorSchema,
      context: ExecutorContext,
      config: StormWorkspaceConfig
    ) =>
      | Promise<BaseExecutorResult | null | undefined>
      | AsyncGenerator<any, BaseExecutorResult | null | undefined>
      | BaseExecutorResult
      | null
      | undefined,
    executorOptions: BaseExecutorOptions<TExecutorSchema> = {}
  ): PromiseExecutor<TExecutorSchema> =>
  async (
    _options: TExecutorSchema,
    context: ExecutorContext
  ): Promise<{ success: boolean }> => {
    const stopwatch = getStopwatch(name);
    let options = _options;

    let config = {} as StormWorkspaceConfig;
    try {
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
        context.projectsConfigurations.projects[context.projectName]!.root ||
        workspaceRoot;
      const sourceRoot =
        context.projectsConfigurations.projects[context.projectName]!
          .sourceRoot ||
        projectRoot ||
        workspaceRoot;
      const projectName = context.projectName;
      config.workspaceRoot = workspaceRoot;

      writeInfo(`⚡ Running the ${name} executor for ${projectName} `, config);

      if (!executorOptions.skipReadingConfig) {
        writeTrace(
          `Loading the Storm Config from environment variables and storm.config.js file...
 - workspaceRoot: ${workspaceRoot}
 - projectRoot: ${projectRoot}
 - sourceRoot: ${sourceRoot}
 - projectName: ${projectName}\n`,
          config
        );

        config = await getConfig(workspaceRoot);
      }

      if (executorOptions?.hooks?.applyDefaultOptions) {
        writeDebug("Running the applyDefaultOptions hook...", config);
        options = await Promise.resolve(
          executorOptions.hooks.applyDefaultOptions(options, config)
        );
        writeDebug("Completed the applyDefaultOptions hook", config);
      }

      writeTrace(
        `Executor schema options ⚙️
${formatLogMessage(options)}
`,
        config
      );

      const tokenized = (await applyWorkspaceTokens<ProjectTokenizerOptions>(
        options,
        defu(
          { workspaceRoot, projectRoot, sourceRoot, projectName, config },
          config,
          context.projectsConfigurations.projects[context.projectName]
        ),
        applyWorkspaceProjectTokens
      )) as TExecutorSchema;

      writeTrace(
        `Executor schema tokenized options ⚙️
${formatLogMessage(tokenized)}
`,
        config
      );

      if (executorOptions?.hooks?.preProcess) {
        writeDebug("Running the preProcess hook...", config);
        await Promise.resolve(
          executorOptions.hooks.preProcess(tokenized, config)
        );
        writeDebug("Completed the preProcess hook", config);
      }

      const ret = executorFn(tokenized, context, config);
      if (_isFunction((ret as AsyncGenerator)?.next)) {
        const asyncGen = ret as AsyncGenerator;
        for await (const iter of asyncGen) {
          void iter;
        }
      }

      const result = await Promise.resolve(
        ret as
          | Promise<BaseExecutorResult | null | undefined>
          | BaseExecutorResult
          | null
          | undefined
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
        writeTrace(
          `Failure determined by the ${name} executor \n${formatLogMessage(result)}`,
          config
        );
        console.error(result);

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
