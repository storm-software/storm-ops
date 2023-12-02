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
      skipReadingConfig: false
    }
  ) =>
  async (
    options: TExecutorSchema,
    context: ExecutorContext
  ): Promise<{ success: boolean }> => {
    const startTime = Date.now();

    try {
      console.info(`⚡ Running the ${name} executor...`);

      if (executorOptions?.applyDefaultFn) {
        options = executorOptions.applyDefaultFn(options);
      }

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
        config = await getDefaultConfig({
          ...(await getConfigFile()),
          ...getConfigEnv()
        });
        setConfigEnv(config);

        getLogLevel(config.logLevel) >= LogLevel.DEBUG &&
          console.debug(
            `Loaded Storm config into env: \n${Object.keys(process.env)
              .map(key => ` - ${key}=${process.env[key]}`)
              .join("\n")}`
          );
      }

      getLogLevel(config.logLevel) >= LogLevel.DEBUG &&
        console.debug(`⚙️  Executor schema options: \n`, options);

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

      console.info(`🎉 Successfully completed running the ${name} executor!`);

      return {
        success: true
      };
    } catch (error) {
      console.error(`❌ An error occurred while running the executor`);
      console.error(error);

      return {
        success: false
      };
    } finally {
      console.info(startTime, name);
    }
  };
