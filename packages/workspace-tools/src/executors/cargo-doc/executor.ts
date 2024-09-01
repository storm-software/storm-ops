import { ExecutorContext, PromiseExecutor } from "@nx/devkit";
import deepClone from "deep-clone";
import { withRunExecutor } from "../../base/base-executor";
import { buildCargoCommand, cargoCommand } from "../../utils/cargo";
import { CargoDocExecutorSchema } from "./schema";

export async function cargoDocExecutor(
  options: CargoDocExecutorSchema,
  context: ExecutorContext
) {
  const opts = deepClone(options);

  opts["no-deps"] = opts.noDeps;
  delete opts.noDeps;

  const command = buildCargoCommand("doc", options, context);
  return await cargoCommand(...command);
}

export default withRunExecutor<CargoDocExecutorSchema>(
  "Cargo Doc",
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
        options.noDeps ??= false;

        return options as CargoDocExecutorSchema;
      }
    }
  }
) as PromiseExecutor<CargoDocExecutorSchema>;
