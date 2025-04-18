import type { GeneratorCallback, Tree } from "@nx/devkit";
import type { StormWorkspaceConfig } from "@storm-software/config";
import {
  applyWorkspaceBaseTokens,
  applyWorkspaceTokens,
  findWorkspaceRoot,
  getConfig,
  getStopwatch,
  writeDebug,
  writeError,
  writeFatal,
  writeInfo,
  writeSuccess,
  writeTrace
} from "@storm-software/config-tools";
import type { BaseGeneratorOptions, BaseGeneratorResult } from "../types";
import type { BaseGeneratorSchema } from "./base-generator.schema.d";

export const withRunGenerator =
  <TGeneratorSchema extends BaseGeneratorSchema = BaseGeneratorSchema>(
    name: string,
    generatorFn: (
      tree: Tree,
      options: TGeneratorSchema,
      config?: StormWorkspaceConfig
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
    _options: TGeneratorSchema
  ): Promise<GeneratorCallback | BaseGeneratorResult> => {
    const stopwatch = getStopwatch(name);
    let options = _options;

    let config: StormWorkspaceConfig | undefined;
    try {
      writeInfo(`⚡ Running the ${name} generator...\n\n`, config);

      const workspaceRoot = findWorkspaceRoot();
      if (!generatorOptions.skipReadingConfig) {
        writeDebug(
          `Loading the Storm Config from environment variables and storm.config.js file...
 - workspaceRoot: ${workspaceRoot}`,
          config
        );

        config = await getConfig(workspaceRoot);
      }

      if (generatorOptions?.hooks?.applyDefaultOptions) {
        writeDebug("Running the applyDefaultOptions hook...", config);
        options = await Promise.resolve(
          generatorOptions.hooks.applyDefaultOptions(options, config)
        );
        writeDebug("Completed the applyDefaultOptions hook", config);
      }

      writeTrace(
        `Generator schema options ⚙️ \n${Object.keys(options ?? {})
          .map(key => ` - ${key}=${JSON.stringify(options[key])}`)
          .join("\n")}`,
        config
      );

      const tokenized = (await applyWorkspaceTokens(
        options as Record<string, any>,
        { workspaceRoot: tree.root, config },
        applyWorkspaceBaseTokens
      )) as TGeneratorSchema;

      if (generatorOptions?.hooks?.preProcess) {
        writeDebug("Running the preProcess hook...", config);
        await Promise.resolve(
          generatorOptions.hooks.preProcess(tokenized, config)
        );
        writeDebug("Completed the preProcess hook", config);
      }

      // Run the generator function
      const result = await Promise.resolve(
        generatorFn(tree, tokenized, config)
      );
      if (result) {
        if (
          result.success === false ||
          (result.error &&
            (result?.error as Error)?.message &&
            typeof (result?.error as Error)?.message === "string" &&
            (result?.error as Error)?.name &&
            typeof (result?.error as Error)?.name === "string")
        ) {
          throw new Error(`The ${name} generator failed to run`, {
            cause: result?.error
          });
        } else if (result.success && result.data) {
          return result as any;
        }
      }

      if (generatorOptions?.hooks?.postProcess) {
        writeDebug("Running the postProcess hook...", config);
        await Promise.resolve(generatorOptions.hooks.postProcess(config));
        writeDebug("Completed the postProcess hook", config);
      }

      return () => {
        writeSuccess(`Completed running the ${name} generator!\n`, config);
      };
    } catch (error) {
      return () => {
        writeFatal(
          "A fatal error occurred while running the generator - the process was forced to terminate",
          config
        );
        writeError(
          `An exception was thrown in the generator's process \n - Details: ${error.message}\n - Stacktrace: ${error.stack}`,
          config
        );
      };
    } finally {
      stopwatch();
    }
  };
