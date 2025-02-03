import { ExecutorContext, PromiseExecutor } from "@nx/devkit";
import { withRunExecutor } from "../../base/base-executor";
import { buildCargoCommand, cargoCommand } from "../../utils/cargo";
import { CargoBuildExecutorSchema } from "./schema.d";

export async function cargoBuildExecutor(
  options: CargoBuildExecutorSchema,
  context: ExecutorContext,
) {
  const command = buildCargoCommand("build", options, context);
  return await cargoCommand(...command);
}

export default withRunExecutor<CargoBuildExecutorSchema>(
  "Cargo Build",
  cargoBuildExecutor,
  {
    skipReadingConfig: false,
    hooks: {
      applyDefaultOptions: (options: CargoBuildExecutorSchema) => {
        options.outputPath ??= "dist/target/{projectRoot}";
        options.toolchain ??= "stable";

        return options as CargoBuildExecutorSchema;
      },
    },
  },
) as PromiseExecutor<CargoBuildExecutorSchema>;
