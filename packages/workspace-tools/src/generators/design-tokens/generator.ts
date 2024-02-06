import { type Tree, joinPathFragments } from "@nx/devkit";
import { runBuild } from "@nxkit/style-dictionary/src/executors/build/lib/style-dictionary/run-build";
import { deleteOutputDir } from "@nxkit/style-dictionary/src/utils/fs/delete-output-path";
import type { StormConfig } from "@storm-software/config";
import { createTailwindConfig } from "@storm-software/design-tools";
import { ConfigType } from "@storm-software/design-tools/types";
import { resolve } from "node:path";
import type { Config, Platform } from "style-dictionary";
import { withRunGenerator } from "../../base/base-generator";
import type { DesignTokensGeneratorSchema, NormalizedDesignTokensGeneratorSchema } from "./schema";

export function designTokensGeneratorFn(
  _tree: Tree,
  schema: DesignTokensGeneratorSchema,
  stormConfig?: StormConfig
) {
  const styleDictionaryConfig: Config | Config[] = createTailwindConfig({
    type: ConfigType.TAILWINDCSS,
    inputPath: schema.inputPath
  });

  const normalizedOptions = normalizeOptions(schema, stormConfig);

  const { deleteOutputPath, outputPath } = normalizedOptions;
  const normalizedConfigs: Config[] = [];

  for (const config of Array.isArray(styleDictionaryConfig)
    ? styleDictionaryConfig
    : [styleDictionaryConfig]) {
    normalizedConfigs.push(normalizeConfig(config, normalizedOptions));
  }

  if (normalizedOptions.outputPath && deleteOutputPath) {
    deleteOutputDir(normalizedOptions.workspaceRoot, outputPath);
  }

  runBuild(normalizedConfigs, normalizedOptions, {} as any);

  return {
    success: true
  };
}

const applyDefaultOptions = (options: DesignTokensGeneratorSchema): DesignTokensGeneratorSchema => {
  return {
    type: ConfigType.TAILWINDCSS,
    ...options
  };
};

export default withRunGenerator<DesignTokensGeneratorSchema>(
  "Design Tokens Creator",
  designTokensGeneratorFn,
  {
    skipReadingConfig: false,
    hooks: {
      applyDefaultOptions
    }
  }
);

function normalizeOptions(
  options: DesignTokensGeneratorSchema,
  config: StormConfig
): NormalizedDesignTokensGeneratorSchema {
  return {
    ...options,
    root: config.workspaceRoot,
    projectRoot: config.runtimeDirectory,
    sourceRoot: config.runtimeDirectory,
    outputPath: resolve(config.workspaceRoot, options.outputPath ?? config.runtimeDirectory ?? ""),
    styleDictionaryConfig: resolve(config.workspaceRoot, options.styleDictionaryConfig),
    tsConfig: resolve(config.workspaceRoot, options.tsConfig)
  };
}

function normalizeConfig(
  styledDictionaryConfig: Config,
  options: NormalizedDesignTokensGeneratorSchema
): Config {
  const normalized: Config = {
    ...styledDictionaryConfig,
    source: styledDictionaryConfig.source.map((src) => resolve(options.projectRoot, src)),
    include: styledDictionaryConfig?.include?.map((include) =>
      resolve(options.projectRoot, include)
    ),
    platforms: Object.entries(styledDictionaryConfig.platforms).reduce(
      (ret: { [key: string]: Platform }, [name, platform]) => {
        ret[name] = {
          ...platform,
          buildPath: joinPathFragments(options.outputPath, platform.buildPath)
        };

        return ret;
      },
      {}
    )
  };

  return normalized;
}
