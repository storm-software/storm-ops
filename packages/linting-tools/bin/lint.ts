import {
  exitWithSuccess,
  handleProcess,
  loadStormConfig,
  writeSuccess,
  writeFatal,
  exitWithError
} from "@storm-software/config-tools";
import { createProgram } from "../src/cli";
import { register as registerTsConfigPaths } from "tsconfig-paths";
import { join } from "node:path";
import { readJsonSync } from "fs-extra";

void (async () => {
  const config = await loadStormConfig();
  try {
    handleProcess(config);

    const compilerOptions = readJsonSync(
      join(config.workspaceRoot ?? "./", "tsconfig.base.json")
    ).compilerOptions;
    registerTsConfigPaths(compilerOptions);

    const program = await createProgram(config);
    program.exitOverride();

    await program.parseAsync(process.argv);

    writeSuccess(config, "Code linting and fixing completed successfully!");
    exitWithSuccess(config);
  } catch (error) {
    writeFatal(config, `A fatal error occurred while running the program: ${error.message}`);
    exitWithError(config);
    process.exit(1);
  }
})();
