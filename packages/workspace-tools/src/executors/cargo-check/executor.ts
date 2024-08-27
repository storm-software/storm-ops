import { ExecutorContext, PromiseExecutor } from "@nx/devkit";
import { withRunExecutor } from "../../base/base-executor";
import { buildCargoCommand, cargoCommand } from "../../utils/cargo";
import { CargoCheckExecutorSchema } from "./schema";

export async function* cargoCheckExecutor(
  options: CargoCheckExecutorSchema,
  context: ExecutorContext
): AsyncGenerator<{ success: boolean }> {
  const command = buildCargoCommand("check", options, context);

  const { success } = await cargoCommand(...command);
  yield {
    success
  };
}

export default withRunExecutor<CargoCheckExecutorSchema>(
  "Cargo Check executor",
  cargoCheckExecutor,
  {
    skipReadingConfig: false,
    hooks: {
      applyDefaultOptions: (options: CargoCheckExecutorSchema) => {
        options.toolchain ??= "stable";
        options.profile ??= "debug";
        options.release ??= false;

        return options as CargoCheckExecutorSchema;
      }
    }
  }
) as PromiseExecutor<CargoCheckExecutorSchema>;
