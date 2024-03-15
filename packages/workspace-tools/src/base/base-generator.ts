import type { Tree } from "@nx/devkit";
import type { StormConfig } from "@storm-software/config";
import { applyWorkspaceBaseTokens, applyWorkspaceTokens } from "@storm-software/config-tools";
import type {
  BaseGeneratorOptions,
  BaseGeneratorResult,
  BaseGeneratorSchema
} from "../../declarations";

export const withRunGenerator =
  <TGeneratorSchema extends BaseGeneratorSchema = any>(
    name: string,
    generatorFn: (
      tree: Tree,
      options: TGeneratorSchema,
      config?: StormConfig
    ) => Promise<BaseGeneratorResult | null | undefined> | BaseGeneratorResult | null | undefined,
    generatorOptions: BaseGeneratorOptions<TGeneratorSchema> = {
      skipReadingConfig: false
    }
  ) =>
  async (tree: Tree, _options: TGeneratorSchema): Promise<{ success: boolean }> => {
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
      writeInfo(config, `⚡ Running the ${name} generator...\n\n`);

      const workspaceRoot = findWorkspaceRoot();
      if (!generatorOptions.skipReadingConfig) {
        writeDebug(
          config,
          `Loading the Storm Config from environment variables and storm.config.js file...
 - workspaceRoot: ${workspaceRoot}`
        );

        config = await loadStormConfig(workspaceRoot);
        writeTrace(
          config,
          `Loaded Storm config into env: \n${Object.keys(process.env)
            .map((key) => ` - ${key}=${JSON.stringify(process.env[key])}`)
            .join("\n")}`
        );
      }

      // process.chdir(workspaceRoot);

      if (generatorOptions?.hooks?.applyDefaultOptions) {
        writeDebug(config, "Running the applyDefaultOptions hook...");
        options = await Promise.resolve(
          generatorOptions.hooks.applyDefaultOptions(options, config)
        );
        writeDebug(config, "Completed the applyDefaultOptions hook");
      }

      writeTrace(
        config,
        `Generator schema options ⚙️ \n${Object.keys(options ?? {})
          .map((key) => ` - ${key}=${JSON.stringify(options[key])}`)
          .join("\n")}`
      );

      const tokenized = (await applyWorkspaceTokens(
        options as Record<string, any>,
        { workspaceRoot: tree.root, config },
        applyWorkspaceBaseTokens
      )) as TGeneratorSchema;

      if (generatorOptions?.hooks?.preProcess) {
        writeDebug(config, "Running the preProcess hook...");
        await Promise.resolve(generatorOptions.hooks.preProcess(tokenized, config));
        writeDebug(config, "Completed the preProcess hook");
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
          cause: result?.error
        });
      }

      if (generatorOptions?.hooks?.postProcess) {
        writeDebug(config, "Running the postProcess hook...");
        await Promise.resolve(generatorOptions.hooks.postProcess(config));
        writeDebug(config, "Completed the postProcess hook");
      }

      writeSuccess(config, `Completed running the ${name} task executor!\n`);

      return {
        ...result,
        success: true
      };
    } catch (error) {
      writeFatal(
        config,
        "A fatal error occurred while running the generator - the process was forced to terminate"
      );
      writeError(
        config,
        `An exception was thrown in the generator's process \n - Details: ${error.message}\n - Stacktrace: ${error.stack}`
      );

      return {
        success: false
      };
    } finally {
      stopwatch();
    }
  };
