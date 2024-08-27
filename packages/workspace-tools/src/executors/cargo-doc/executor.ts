import { ExecutorContext, PromiseExecutor } from "@nx/devkit";
import { withRunExecutor } from "../../base/base-executor";
import { buildCargoCommand, cargoCommand } from "../../utils/cargo";
import { CargoDocExecutorSchema } from "./schema";

export async function* cargoDocExecutor(
  options: CargoDocExecutorSchema,
  context: ExecutorContext
): AsyncGenerator<{ success: boolean }> {
  const command = buildCargoCommand("doc", options, context);

  const { success } = await cargoCommand(...command);
  yield {
    success
  };
}

export default withRunExecutor<CargoDocExecutorSchema>(
  "Cargo Doc executor",
  cargoDocExecutor,
  {
    skipReadingConfig: false,
    hooks: {
      applyDefaultOptions: (options: CargoDocExecutorSchema) => {
        options.outputPath ??= "dist/docs/{projectRoot}";
        options.toolchain ??= "stable";
        options.release ??= options.profile ? false : true;
        options.allFeatures ??= true;
        options.lib ??= true;
        options.bins ??= true;
        options.examples ??= true;

        return options as CargoDocExecutorSchema;
      }
    }
  }
) as PromiseExecutor<CargoDocExecutorSchema>;
