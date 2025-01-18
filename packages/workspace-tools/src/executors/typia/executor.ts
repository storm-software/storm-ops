import type { ExecutorContext } from "@nx/devkit";
import type { StormConfig } from "@storm-software/config";
import { writeInfo } from "@storm-software/config-tools/logger/console";
import { removeSync } from "fs-extra";
import { TypiaProgrammer } from "typia/lib/programmers/TypiaProgrammer.js";
import { withRunExecutor } from "../../base/base-executor";
import type { TypiaExecutorSchema } from "./schema.d";

export async function typiaExecutorFn(
  options: TypiaExecutorSchema,
  _: ExecutorContext,
  config: StormConfig
) {
  if (options.clean !== false) {
    writeInfo(`🧹 Cleaning output path: ${options.outputPath}`, config);
    removeSync(options.outputPath);
  }

  await Promise.all(
    options.entry!.map(entry => {
      writeInfo(`🚀 Running Typia on entry: ${entry}`, config);

      return TypiaProgrammer.build({
        input: entry,
        output: options.outputPath!,
        project: options.tsconfig!
      });
    })
  );

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
      applyDefaultOptions: (
        options: TypiaExecutorSchema
      ): TypiaExecutorSchema => {
        options.entry ??= ["{sourceRoot}/index.ts"];
        options.outputPath ??= "{sourceRoot}/__generated__/typia";
        options.tsconfig ??= "{projectRoot}/tsconfig.json";
        options.clean ??= true;

        return options;
      }
    }
  }
);
