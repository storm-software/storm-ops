import type { StormConfig } from "@storm-software/config";
import { writeError, writeFatal, writeSuccess, writeTrace } from "./logger";

export const exitWithError = (config: Partial<StormConfig>) => {
  writeFatal(config, "Exiting script with an error status...");
  process.exit(1);
};

export const exitWithSuccess = (config: Partial<StormConfig>) => {
  writeSuccess(config, "Script completed successfully. Exiting...");
  process.exit(0);
};

export const handleProcess = (config: Partial<StormConfig>) => {
  writeTrace(
    config,
    `Using the following arguments to process the script: ${process.argv.join(", ")}`
  );

  process.on("unhandledRejection", (error) => {
    writeError(config, `An Unhandled Rejection occurred while running the program: ${error}`);
    exitWithError(config);
  });
  process.on("uncaughtException", (error) => {
    writeError(
      config,
      `An Uncaught Exception occurred while running the program: ${error.message} \nStacktrace: ${error.stack}`
    );
    exitWithError(config);
  });

  process.on("SIGTERM", (signal: NodeJS.Signals) => {
    writeError(config, `The program terminated with signal code: ${signal}`);
    exitWithError(config);
  });
  process.on("SIGINT", (signal: NodeJS.Signals) => {
    writeError(config, `The program terminated with signal code: ${signal}`);
    exitWithError(config);
  });
  process.on("SIGHUP", (signal: NodeJS.Signals) => {
    writeError(config, `The program terminated with signal code: ${signal}`);
    exitWithError(config);
  });
};
