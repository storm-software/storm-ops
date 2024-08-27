import { ExecutorContext, PromiseExecutor } from "@nx/devkit";
import { withRunExecutor } from "../../base/base-executor";
import { buildCargoCommand, cargoCommand } from "../../utils/cargo";
import { CargoFormatExecutorSchema } from "./schema";

export async function* cargoFormatExecutor(
  options: CargoFormatExecutorSchema,
  context: ExecutorContext
): AsyncGenerator<{ success: boolean }> {
  const command = buildCargoCommand("fmt", options, context);

  const { success } = await cargoCommand(...command);
  yield {
    success
  };
}

export default withRunExecutor<CargoFormatExecutorSchema>(
  "Cargo Format executor",
  cargoFormatExecutor,
  {
    skipReadingConfig: false,
    hooks: {
      applyDefaultOptions: (options: CargoFormatExecutorSchema) => {
        options.outputPath ??= "dist/target/{projectRoot}";
        options.toolchain ??= "stable";
        options.release ??= false;

        return options as CargoFormatExecutorSchema;
      }
    }
  }
) as PromiseExecutor<CargoFormatExecutorSchema>;
