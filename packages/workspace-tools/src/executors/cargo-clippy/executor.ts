import { ExecutorContext, PromiseExecutor } from "@nx/devkit";
import { withRunExecutor } from "../../base/base-executor";
import { buildCargoCommand, cargoCommand } from "../../utils/cargo";
import { CargoClippyExecutorSchema } from "./schema";

export async function* cargoClippyExecutor(
  options: CargoClippyExecutorSchema,
  context: ExecutorContext
): AsyncGenerator<{ success: boolean }> {
  const command = buildCargoCommand("clippy", options, context);

  const { success } = await cargoCommand(...command);
  yield {
    success
  };
}

export default withRunExecutor<CargoClippyExecutorSchema>(
  "Cargo Clippy executor",
  cargoClippyExecutor,
  {
    skipReadingConfig: false,
    hooks: {
      applyDefaultOptions: (options: CargoClippyExecutorSchema) => {
        options.toolchain ??= "stable";
        options.profile ??= "dev";
        options.release ??= false;
        options.fix ??= false;

        return options as CargoClippyExecutorSchema;
      }
    }
  }
) as PromiseExecutor<CargoClippyExecutorSchema>;
