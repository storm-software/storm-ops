import { ExecutorContext } from "@nx/devkit";
import { getConfigFile } from "@storm-software/config-tools/config-file/get-config-file";
import { getConfigEnv } from "@storm-software/config-tools/env/get-env";
import { setConfigEnv } from "@storm-software/config-tools/env/set-env";
import { StormConfig } from "@storm-software/config-tools/types";
import { getDefaultConfig } from "@storm-software/config-tools/utilities/get-default-config";
import { applyWorkspaceTokens } from "../utils/apply-workspace-tokens";

export interface BaseExecutorSchema extends Record<string, any> {
  main?: string;
  outputPath?: string;
  tsConfig?: string;
}

export interface BaseExecutorOptions {
  skipReadingConfig?: boolean;
}

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
    executorOptions: BaseExecutorOptions = { skipReadingConfig: false }
  ) =>
  async (
    options: TExecutorSchema,
    context: ExecutorContext
  ): Promise<{ success: boolean }> => {
    const startTime = Date.now();

    try {
      console.info(`⚡ Running the ${name} executor...`);
      console.debug(`⚙️ Executor schema options: \n`, options);

      const tokenized = Object.keys(options).reduce(
        (ret: TExecutorSchema, key: keyof TExecutorSchema) => {
          ret[key] = applyWorkspaceTokens(
            options[key],
            context
          ) as TExecutorSchema[keyof TExecutorSchema];

          return ret;
        },
        options
      );

      let config: StormConfig | undefined;
      if (!executorOptions.skipReadingConfig) {
        const configFile = await getConfigFile();
        const configEnv = getConfigEnv();

        config = await getDefaultConfig({
          ...configFile,
          ...configEnv
        });
        setConfigEnv(config);

        console.debug(`Loaded Storm config into env:
${Object.keys(process.env)
  .map(key => ` - ${key}=${process.env[key]}`)
  .join("\n")}`);
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
