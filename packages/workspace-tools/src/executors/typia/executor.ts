import type { ExecutorContext } from "@nx/devkit";
import type { StormConfig } from "@storm-software/config-tools";
import { TypiaProgrammer } from "typia/lib/programmers/TypiaProgrammer";
import { withRunExecutor } from "../../base/base-executor";
import type { TypiaExecutorSchema } from "./schema";

export async function typiaExecutorFn(
  options: TypiaExecutorSchema,
  _: ExecutorContext,
  __?: StormConfig
) {
  await TypiaProgrammer.build({
    input: options.entry,
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
        options.entry ??= "{sourceRoot}/index.ts";
        options.outputPath ??= "{sourceRoot}/__generated__/typia";
        options.tsConfig ??= "tsconfig.json";

        return options;
      }
    }
  }
);
