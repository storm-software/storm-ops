import { ExecutorContext } from "@nx/devkit";
import {
  LogLevel,
  StormConfig,
  getConfigEnv,
  getConfigFile,
  getDefaultConfig,
  getLogLevel,
  setConfigEnv
} from "@storm-software/config-tools";
import * as chalk from "chalk";
import { BaseWorkspaceToolOptions } from "../types";
import {
  applyWorkspaceExecutorTokens,
  applyWorkspaceTokens
} from "../utils/apply-workspace-tokens";
import { getWorkspaceRoot } from "../utils/get-workspace-root";

export interface BaseExecutorSchema extends Record<string, any> {
  main?: string;
  outputPath?: string;
  tsConfig?: string;
}

export interface BaseExecutorOptions<
  TExecutorSchema extends BaseExecutorSchema = BaseExecutorSchema
> extends BaseWorkspaceToolOptions<TExecutorSchema> {}

export interface BaseExecutorResult {
  error?: Error;
  success?: boolean;
}

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
    executorOptions: BaseExecutorOptions<TExecutorSchema> = {
      skipReadingConfig: false,
      hooks: {}
    }
  ) =>
  async (
    options: TExecutorSchema,
    context: ExecutorContext
  ): Promise<{ success: boolean }> => {
    const startTime = Date.now();

    try {
      console.info(
        chalk.bold.hex("#1fb2a6")(`⚡ Running the ${name} executor...\n\n`)
      );

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
      const projectRoot =
        context.projectsConfigurations.projects[context.projectName].root;
      const sourceRoot =
        context.projectsConfigurations.projects[context.projectName].sourceRoot;
      const projectName =
        context.projectsConfigurations.projects[context.projectName].name;

      let config: StormConfig | undefined;
      if (!executorOptions.skipReadingConfig) {
        config = getDefaultConfig({
          ...(await getConfigFile()),
          ...getConfigEnv()
        });
        setConfigEnv(config);

        getLogLevel(config.logLevel) >= LogLevel.DEBUG &&
          console.debug(
            chalk.dim(
              `Loaded Storm config into env: \n${Object.keys(process.env)
                .map(key => ` - ${key}=${process.env[key]}`)
                .join("\n")}`
            )
          );
      }

      if (executorOptions?.hooks?.applyDefaultOptions) {
        getLogLevel(config?.logLevel) >= LogLevel.TRACE &&
          console.debug(chalk.dim(`Running the applyDefaultOptions hook...`));
        options = await Promise.resolve(
          executorOptions.hooks.applyDefaultOptions(options, config)
        );
        getLogLevel(config?.logLevel) >= LogLevel.TRACE &&
          console.debug(chalk.dim(`Completed the applyDefaultOptions hook...`));
      }

      getLogLevel(config.logLevel) >= LogLevel.INFO &&
        console.info(
          chalk.hex("#0ea5e9").italic(`\n\n ⚙️  Executor schema options: \n`),
          options
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
        getLogLevel(config?.logLevel) >= LogLevel.TRACE &&
          console.debug(chalk.dim(`Running the preProcess hook...`));
        await Promise.resolve(
          executorOptions.hooks.preProcess(tokenized, config)
        );
        getLogLevel(config?.logLevel) >= LogLevel.TRACE &&
          console.debug(chalk.dim(`Completed the preProcess hook...`));
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
          cause: result!.error
        });
      }

      if (executorOptions?.hooks?.postProcess) {
        getLogLevel(config?.logLevel) >= LogLevel.TRACE &&
          console.debug(chalk.dim(`Running the postProcess hook...`));
        await Promise.resolve(executorOptions.hooks.postProcess(config));
        getLogLevel(config?.logLevel) >= LogLevel.TRACE &&
          console.debug(chalk.dim(`Completed the postProcess hook...`));
      }

      console.info(
        chalk.bold.hex("#087f5b")(
          `\n\n🎉 Successfully completed running the ${name} executor!\n\n`
        )
      );

      return {
        success: true
      };
    } catch (error) {
      console.error(
        chalk.bold.hex("#7d1a1a")(
          `❌  An error occurred while running the executor\n\n`
        ),
        error
      );

      return {
        success: false
      };
    } finally {
      console.info(
        chalk.dim(
          `⏱️  The${name ? ` ${name}` : ""} generator took ${
            Date.now() - startTime
          }ms to complete`
        )
      );
    }
  };
