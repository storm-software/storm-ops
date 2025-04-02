import {
  writeError,
  writeTrace
} from "@storm-software/config-tools/logger/console";
import { isVerbose } from "@storm-software/config-tools/logger/get-log-level";
import { joinPaths } from "@storm-software/config-tools/utilities/correct-paths";
import { StormWorkspaceConfig } from "@storm-software/config/types";
import { glob } from "glob";
import { loadSchema } from "untyped/loader";
import { generateDeclarationFile } from "./generators/dts";
import { generateJsonSchemaFile } from "./generators/json-schema";
import { generateMarkdownFile } from "./generators/markdown";

export const getGenerateAction =
  (config: StormWorkspaceConfig) =>
  async (options: { entry?: string | string[]; outputPath?: string }) => {
    writeTrace(
      `Running Storm Untyped with options: ${JSON.stringify(options)}`,
      config
    );

    const files = await glob(options.entry || "**/{untyped.ts,*.untyped.ts}", {
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
              fsCache: config.skipCache
                ? false
                : joinPaths(
                    config.directories.cache ||
                      joinPaths(
                        config.workspaceRoot,
                        "node_modules/.cache/storm"
                      ),
                    "jiti"
                  ),
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
