import type { StormConfig } from "@storm-software/config";
import {
  writeError,
  writeFatal,
  writeSuccess,
  writeTrace,
} from "../logger/console";

export const exitWithError = (config?: Partial<StormConfig>) => {
  writeFatal("Exiting script with an error status...", config);
  process.exit(1);
};

export const exitWithSuccess = (config?: Partial<StormConfig>) => {
  writeSuccess("Script completed successfully. Exiting...", config);
  process.exit(0);
};

export const handleProcess = (config?: Partial<StormConfig>) => {
  writeTrace(
    `Using the following arguments to process the script: ${process.argv.join(", ")}`,
    config,
  );

  process.on("unhandledRejection", (error) => {
    writeError(
      `An Unhandled Rejection occurred while running the program: ${error}`,
      config,
    );
    exitWithError(config);
  });
  process.on("uncaughtException", (error) => {
    writeError(
      `An Uncaught Exception occurred while running the program: ${error.message} \nStacktrace: ${error.stack}`,
      config,
    );
    exitWithError(config);
  });

  process.on("SIGTERM", (signal: NodeJS.Signals) => {
    writeError(`The program terminated with signal code: ${signal}`, config);
    exitWithError(config);
  });
  process.on("SIGINT", (signal: NodeJS.Signals) => {
    writeError(`The program terminated with signal code: ${signal}`, config);
    exitWithError(config);
  });
  process.on("SIGHUP", (signal: NodeJS.Signals) => {
    writeError(`The program terminated with signal code: ${signal}`, config);
    exitWithError(config);
  });
};
