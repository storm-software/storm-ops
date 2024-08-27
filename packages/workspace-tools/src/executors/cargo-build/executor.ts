import { ExecutorContext, PromiseExecutor } from "@nx/devkit";
import { withRunExecutor } from "../../base/base-executor";
import { buildCargoCommand, cargoCommand } from "../../utils/cargo";
import { CargoBuildExecutorSchema } from "./schema";

export async function* cargoBuildExecutor(
  options: CargoBuildExecutorSchema,
  context: ExecutorContext
): AsyncGenerator<{ success: boolean }> {
  const command = buildCargoCommand("build", options, context);

  const { success } = await cargoCommand(...command);
  yield {
    success
  };
}

export default withRunExecutor<CargoBuildExecutorSchema>(
  "Cargo Build executor",
  cargoBuildExecutor,
  {
    skipReadingConfig: false,
    hooks: {
      applyDefaultOptions: (options: CargoBuildExecutorSchema) => {
        options.outputPath ??= "dist/target/{projectRoot}";
        options.toolchain ??= "stable";
        options.release ??= false;

        return options as CargoBuildExecutorSchema;
      }
    }
  }
) as PromiseExecutor<CargoBuildExecutorSchema>;
