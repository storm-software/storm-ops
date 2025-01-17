import { ExecutorContext, PromiseExecutor } from "@nx/devkit";
import { withRunExecutor } from "../../base/base-executor";
import { buildCargoCommand, cargoCommand } from "../../utils/cargo";
import { CargoClippyExecutorSchema } from "./schema.d";

export async function cargoClippyExecutor(
  options: CargoClippyExecutorSchema,
  context: ExecutorContext
) {
  const command = buildCargoCommand("clippy", options, context);
  return await cargoCommand(...command);
}

export default withRunExecutor<CargoClippyExecutorSchema>(
  "Cargo Clippy",
  cargoClippyExecutor,
  {
    skipReadingConfig: false,
    hooks: {
      applyDefaultOptions: (options: CargoClippyExecutorSchema) => {
        options.toolchain ??= "stable";
        options.fix ??= false;

        return options as CargoClippyExecutorSchema;
      }
    }
  }
) as PromiseExecutor<CargoClippyExecutorSchema>;
