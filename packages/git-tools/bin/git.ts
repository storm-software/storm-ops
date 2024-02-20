import { exitWithSuccess, handleProcess, writeSuccess } from "@storm-software/config-tools";
import { loadStormConfig } from "@storm-software/config-tools";
import { createProgram } from "../src/cli/index.js";

void (async () => {
  const config = await loadStormConfig();
  handleProcess(config);

  const program = await createProgram(config);
  // program.exitOverride();
  await program.parseAsync(process.argv);

  writeSuccess(
    config,
    `Git ${process.argv.join(" ") ?? "tool"} processing completed successfully!`
  );

  exitWithSuccess(config);
})();

// .then(() => {
//   loadStormConfig().then((config) => exitWithSuccess(config));
// });
