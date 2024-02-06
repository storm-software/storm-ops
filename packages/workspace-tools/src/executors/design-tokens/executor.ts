import type { ExecutorContext } from "@nx/devkit";
import { normalizeStyleDictionaryConfig } from "@nxkit/style-dictionary/src/executors/build/lib/normalize-config";
import { normalizeOptions } from "@nxkit/style-dictionary/src/executors/build/lib/normalize-options";
import { runBuild } from "@nxkit/style-dictionary/src/executors/build/lib/style-dictionary/run-build";
import { deleteOutputDir } from "@nxkit/style-dictionary/src/utils/fs/delete-output-path";
import { createTailwindConfig } from "@storm-software/design-tools";
import { ConfigType } from "@storm-software/design-tools/types";
import type { Config } from "style-dictionary";
import { withRunExecutor } from "../../base/base-executor";
import type { DesignTokensExecutorSchema } from "./schema";

export const designTokensExecutorFn = (
  options: DesignTokensExecutorSchema,
  context: ExecutorContext
) => {
  const styleDictionaryConfig: Config | Config[] = createTailwindConfig({
    type: ConfigType.TAILWINDCSS,
    inputPath: options.inputPath
  });

  const normalizedOptions = normalizeOptions(options, context);

  const { deleteOutputPath, outputPath } = normalizedOptions;
  const normalizedConfigs: Config[] = [];

  for (const config of Array.isArray(styleDictionaryConfig)
    ? styleDictionaryConfig
    : [styleDictionaryConfig]) {
    normalizedConfigs.push(normalizeStyleDictionaryConfig(config, normalizedOptions, context));
  }

  if (options.outputPath && deleteOutputPath) {
    deleteOutputDir(context.root, outputPath);
  }

  runBuild(normalizedConfigs, normalizedOptions, context);

  return {
    success: true
  };
};

const applyDefaultOptions = (options: DesignTokensExecutorSchema): DesignTokensExecutorSchema => {
  return {
    type: ConfigType.TAILWINDCSS,
    ...options
  };
};

export default withRunExecutor<DesignTokensExecutorSchema>(
  "Design Token CodeGen",
  designTokensExecutorFn,
  {
    skipReadingConfig: false,
    hooks: {
      applyDefaultOptions
    }
  }
);
