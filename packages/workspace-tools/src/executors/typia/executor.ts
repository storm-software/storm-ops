import type { ExecutorContext } from "@nx/devkit";
import { type StormConfig, writeInfo } from "@storm-software/config-tools";
import { removeSync } from "fs-extra";
import { TypiaProgrammer } from "typia/lib/programmers/TypiaProgrammer";
import { withRunExecutor } from "../../base/base-executor";
import type { TypiaExecutorSchema } from "./schema";

export async function typiaExecutorFn(
  options: TypiaExecutorSchema,
  _: ExecutorContext,
  config?: StormConfig
) {
  if (options.clean !== false) {
    writeInfo(config, `🧹 Cleaning output path: ${options.outputPath}`);
    removeSync(options.outputPath);
  }

  await TypiaProgrammer.build({
    input: options.entryPath,
    output: options.outputPath,
    project: options.tsConfig
  });

  return {
    success: true
  };
}

export default withRunExecutor<TypiaExecutorSchema>(
  "Typia runtime validation generator",
  typiaExecutorFn,
  {
    skipReadingConfig: false,
    hooks: {
      applyDefaultOptions: (options: TypiaExecutorSchema): TypiaExecutorSchema => {
        options.entryPath ??= "{sourceRoot}";
        options.outputPath ??= "{sourceRoot}/__generated__/typia";
        options.tsConfig ??= "{projectRoot}/tsconfig.json";
        options.clean ??= true;

        return options;
      }
    }
  }
);
