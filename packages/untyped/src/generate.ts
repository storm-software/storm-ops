import {
  writeError,
  writeTrace
} from "@storm-software/config-tools/logger/console";
import { isVerbose } from "@storm-software/config-tools/logger/get-log-level";
import { joinPaths } from "@storm-software/config-tools/utilities/correct-paths";
import { StormConfig } from "@storm-software/config/types";
import { glob } from "glob";
import { loadSchema } from "untyped/loader";
import { generateDeclarationFile } from "./generators/dts";
import { generateJsonSchemaFile } from "./generators/json-schema";
import { generateMarkdownFile } from "./generators/markdown";

export const getGenerateAction =
  (config: StormConfig) =>
  async (options: {
    entry: string | string[];
    outputPath: string;
    jsonSchema: string;
  }) => {
    const files = await glob(options.entry, {
      ignore: [
        "**/{*.stories.tsx,*.stories.ts,*.spec.tsx,*.spec.ts}",
        "**/dist/**",
        "**/tmp/**",
        "**/node_modules/**",
        "**/.git/**",
        "**/.cache/**",
        "**/.nx/**"
      ],
      withFileTypes: true,
      cwd: config.workspaceRoot
    });

    const cache =
      !Boolean(process.env.CI) &&
      !Boolean(process.env.STORM_CI) &&
      !config.skipCache;
    writeTrace(
      cache
        ? `Skipping jiti cache because ${Boolean(process.env.CI) ? '`process.env.CI` is set to "true"' : Boolean(process.env.STORM_CI) ? '`process.env.STORM_CI` is set to "true"' : config.skipCache ? "`skipCache` in the Storm configuration file is set to `true`" : "<INVALID REASON>"}`
        : "Will use jiti cache while parsing schema files",
      config
    );

    await Promise.all(
      files.map(async file => {
        writeTrace(
          `Generating files for schema file: ${joinPaths(file.parentPath, file.name)}`,
          config
        );

        let schema;
        try {
          schema = await loadSchema(joinPaths(file.parentPath, file.name), {
            jiti: {
              debug: isVerbose(config.logLevel),
              fsCache:
                cache &&
                joinPaths(
                  config.directories.cache || "node_modules/.cache",
                  "storm",
                  "untyped"
                ),
              moduleCache: cache,
              extensions: ["ts", ".tsx", ".mts", ".cts", ".mtsx", ".ctsx"],
              interopDefault: true
            }
          });
        } catch (error) {
          writeError(
            `Error while parsing schema file: ${joinPaths(file.parentPath, file.name)}

Error:
${error?.message ? error.message : JSON.stringify(error)}${
              error?.stack
                ? `
Stack Trace: ${error.stack}`
                : ""
            }

Parsed schema:
${JSON.stringify(schema)}
`,

            config
          );

          throw error;
        }

        const promises = [] as Promise<any>[];

        promises.push(generateDeclarationFile(schema, file, config));
        promises.push(generateMarkdownFile(schema, file, config));
        promises.push(generateJsonSchemaFile(schema, file, config));

        return Promise.all(promises);
      })
    );
  };
