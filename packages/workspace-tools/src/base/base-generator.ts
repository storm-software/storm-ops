import { Tree } from "@nx/devkit";
import { getConfigFile } from "@storm-software/config-tools/config-file/get-config-file";
import { getConfigEnv } from "@storm-software/config-tools/env/get-env";
import { setConfigEnv } from "@storm-software/config-tools/env/set-env";
import { StormConfig } from "@storm-software/config-tools/types";
import { getDefaultConfig } from "@storm-software/config-tools/utilities/get-default-config";
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

      if (generatorOptions?.applyDefaultFn) {
        options = generatorOptions.applyDefaultFn(options);
      }

      console.debug("⚙️  Generator schema options: \n", options);

      const tokenized = applyWorkspaceTokens(
        options,
        { workspaceRoot: tree.root },
        applyWorkspaceGeneratorTokens
      ) as TGeneratorSchema;

      let config: any | undefined;
      if (!generatorOptions.skipReadingConfig) {
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
