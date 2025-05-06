import { ExecutorContext, PromiseExecutor } from "@nx/devkit";
import { withRunExecutor } from "../../base/base-executor";
import { buildCargoCommand, cargoCommand } from "../../utils/cargo";
import { CargoFormatExecutorSchema } from "./schema.d";

export async function cargoFormatExecutor(
  options: CargoFormatExecutorSchema,
  context: ExecutorContext
) {
  const command = buildCargoCommand("fmt", options, context);
  return await cargoCommand(...command);
}

export default withRunExecutor<CargoFormatExecutorSchema>(
  "Cargo Format",
  cargoFormatExecutor,
  {
    skipReadingConfig: false,
    hooks: {
      applyDefaultOptions: (options: CargoFormatExecutorSchema) => {
        options.outputPath ??= "dist/{projectRoot}/target";
        options.toolchain ??= "stable";

        return options as CargoFormatExecutorSchema;
      }
    }
  }
) as PromiseExecutor<CargoFormatExecutorSchema>;
