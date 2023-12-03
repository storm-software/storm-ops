import { Tree } from "@nx/devkit";
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
  applyWorkspaceGeneratorTokens,
  applyWorkspaceTokens
} from "../utils/apply-workspace-tokens";

export interface BaseGeneratorSchema extends Record<string, any> {
  main?: string;
  outputPath?: string;
  tsConfig?: string;
}

export interface BaseGeneratorOptions<
  TGeneratorSchema extends BaseGeneratorSchema = BaseGeneratorSchema
> extends BaseWorkspaceToolOptions<TGeneratorSchema> {}

export interface BaseGeneratorResult {
  error?: Error;
  success?: boolean;
}

export const withRunGenerator =
  <TGeneratorSchema = any>(
    name: string,
    generatorFn: (
      tree: Tree,
      options: TGeneratorSchema,
      config?: StormConfig
    ) =>
      | Promise<BaseGeneratorResult | null | undefined>
      | BaseGeneratorResult
      | null
      | undefined,
    generatorOptions: BaseGeneratorOptions<TGeneratorSchema> = {
      skipReadingConfig: false
    }
  ) =>
  async (
    tree: Tree,
    options: TGeneratorSchema
  ): Promise<{ success: boolean }> => {
    const startTime = Date.now();

    try {
      console.info(`⚡ Running the ${name} generator...`);

      let config: any | undefined;
      if (!generatorOptions.skipReadingConfig) {
        config = getDefaultConfig({
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

      if (generatorOptions?.hooks?.applyDefaultOptions) {
        getLogLevel(config?.logLevel) >= LogLevel.TRACE &&
          console.debug(`Running the applyDefaultOptions hook...`);
        options = await Promise.resolve(
          generatorOptions.hooks.applyDefaultOptions(options, config)
        );
        getLogLevel(config?.logLevel) >= LogLevel.TRACE &&
          console.debug(`Completed the applyDefaultOptions hook...`);
      }

      getLogLevel(config.logLevel) >= LogLevel.DEBUG &&
        console.debug("⚙️  Generator schema options: \n", options);

      const tokenized = applyWorkspaceTokens(
        options,
        { workspaceRoot: tree.root, config },
        applyWorkspaceGeneratorTokens
      ) as TGeneratorSchema;

      if (generatorOptions?.hooks?.preProcess) {
        getLogLevel(config?.logLevel) >= LogLevel.TRACE &&
          console.debug(`Running the preProcess hook...`);
        await Promise.resolve(
          generatorOptions.hooks.preProcess(options, config)
        );
        getLogLevel(config?.logLevel) >= LogLevel.TRACE &&
          console.debug(`Completed the preProcess hook...`);
      }

      const result = await Promise.resolve(
        generatorFn(tree, tokenized, config)
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
        throw new Error(`The ${name} generator failed to run`, {
          cause: result!.error
        });
      }

      if (generatorOptions?.hooks?.postProcess) {
        getLogLevel(config?.logLevel) >= LogLevel.TRACE &&
          console.debug(`Running the postProcess hook...`);
        await Promise.resolve(generatorOptions.hooks.postProcess(config));
        getLogLevel(config?.logLevel) >= LogLevel.TRACE &&
          console.debug(`Completed the postProcess hook...`);
      }

      console.info(`🎉 Successfully completed running the ${name} generator!`);

      return {
        success: true
      };
    } catch (error) {
      console.error(`❌ An error occurred while running the generator`);
      console.error(error);

      return {
        success: false
      };
    } finally {
      console.info(
        `⏱️ The${name ? ` ${name}` : ""} generator took ${
          Date.now() - startTime
        }ms to complete`
      );
    }
  };
