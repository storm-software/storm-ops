import { Tree } from "@nx/devkit";
import {
  LogLevel,
  StormConfig,
  getConfigEnv,
  getConfigFile,
  getDefaultConfig,
  getLogLevel,
  setConfigEnv,
} from "@storm-software/config-tools";
import * as chalk from "chalk";
import { BaseWorkspaceToolOptions } from "../types";
import {
  applyWorkspaceGeneratorTokens,
  applyWorkspaceTokens,
} from "../utils/apply-workspace-tokens";

export interface BaseGeneratorSchema extends Record<string, any> {
  main?: string;
  outputPath?: string;
  tsConfig?: string;
}

export interface BaseGeneratorOptions<
  TGeneratorSchema extends BaseGeneratorSchema = BaseGeneratorSchema,
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
    ) => Promise<BaseGeneratorResult | null | undefined> | BaseGeneratorResult | null | undefined,
    generatorOptions: BaseGeneratorOptions<TGeneratorSchema> = {
      skipReadingConfig: false,
    }
  ) =>
  async (tree: Tree, _options: TGeneratorSchema): Promise<{ success: boolean }> => {
    const startTime = Date.now();
    let options = _options;

    try {
      console.info(chalk.bold.hex("#1fb2a6")(`⚡ Running the ${name} generator...\n\n`));

      let config: any | undefined;
      if (!generatorOptions.skipReadingConfig) {
        config = getDefaultConfig({
          ...(await getConfigFile()),
          ...getConfigEnv(),
        });
        setConfigEnv(config);

        getLogLevel(config.logLevel) >= LogLevel.DEBUG &&
          console.debug(
            chalk.dim(
              `Loaded Storm config into env: \n${Object.keys(process.env)
                .map((key) => ` - ${key}=${process.env[key]}`)
                .join("\n")}`
            )
          );
      }

      if (generatorOptions?.hooks?.applyDefaultOptions) {
        getLogLevel(config?.logLevel) >= LogLevel.TRACE &&
          console.debug(chalk.dim("Running the applyDefaultOptions hook..."));
        options = await Promise.resolve(
          generatorOptions.hooks.applyDefaultOptions(options, config)
        );
        getLogLevel(config?.logLevel) >= LogLevel.TRACE &&
          console.debug(chalk.dim("Completed the applyDefaultOptions hook..."));
      }

      getLogLevel(config.logLevel) >= LogLevel.INFO &&
        console.info(chalk.hex("#0ea5e9").italic("\n\n ⚙️  Generator schema options: \n"), options);

      const tokenized = applyWorkspaceTokens(
        options,
        { workspaceRoot: tree.root, config },
        applyWorkspaceGeneratorTokens
      ) as TGeneratorSchema;

      if (generatorOptions?.hooks?.preProcess) {
        getLogLevel(config?.logLevel) >= LogLevel.TRACE &&
          console.debug(chalk.dim("Running the preProcess hook..."));
        await Promise.resolve(generatorOptions.hooks.preProcess(options, config));
        getLogLevel(config?.logLevel) >= LogLevel.TRACE &&
          console.debug(chalk.dim("Completed the preProcess hook..."));
      }

      const result = await Promise.resolve(generatorFn(tree, tokenized, config));
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
          cause: result?.error,
        });
      }

      if (generatorOptions?.hooks?.postProcess) {
        getLogLevel(config?.logLevel) >= LogLevel.TRACE &&
          console.debug(chalk.dim("Running the postProcess hook..."));
        await Promise.resolve(generatorOptions.hooks.postProcess(config));
        getLogLevel(config?.logLevel) >= LogLevel.TRACE &&
          console.debug(chalk.dim("Completed the postProcess hook..."));
      }

      console.info(
        chalk.bold.hex("#087f5b")(`\n\n🎉 Successfully completed running the ${name} generator!`)
      );

      return {
        success: true,
      };
    } catch (error) {
      console.error(
        chalk.bold.hex("#7d1a1a")("❌  An error occurred while running the generator\n\n"),
        error
      );
      console.error(error);

      return {
        success: false,
      };
    } finally {
      console.info(
        chalk
          .hex("#0ea5e9")
          .italic(
            `⏱️  The${name ? ` ${name}` : ""} generator took ${Date.now() - startTime}ms to complete`
          )
      );
    }
  };
