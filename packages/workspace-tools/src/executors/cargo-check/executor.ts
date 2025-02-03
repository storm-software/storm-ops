import { ExecutorContext, PromiseExecutor } from "@nx/devkit";
import { withRunExecutor } from "../../base/base-executor";
import { buildCargoCommand, cargoCommand } from "../../utils/cargo";
import { CargoCheckExecutorSchema } from "./schema.d";

export async function cargoCheckExecutor(
  options: CargoCheckExecutorSchema,
  context: ExecutorContext,
) {
  const command = buildCargoCommand("check", options, context);
  return await cargoCommand(...command);
}

export default withRunExecutor<CargoCheckExecutorSchema>(
  "Cargo Check",
  cargoCheckExecutor,
  {
    skipReadingConfig: false,
    hooks: {
      applyDefaultOptions: (options: CargoCheckExecutorSchema) => {
        options.toolchain ??= "stable";

        return options as CargoCheckExecutorSchema;
      },
    },
  },
) as PromiseExecutor<CargoCheckExecutorSchema>;
