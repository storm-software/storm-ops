import { writeTrace } from "@storm-software/config-tools/logger/console";
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
      ignore: "**/{*.stories.tsx,*.stories.ts,*.spec.tsx,*.spec.ts}",
      withFileTypes: true,
      cwd: config.workspaceRoot
    });

    writeTrace(
      `Generating files for schema files: ${files.join(", ")}`,
      config
    );
    await Promise.all(
      files.map(async file => {
        const schema = await loadSchema(joinPaths(file.parentPath, file.name), {
          jiti: {
            debug: false,
            cache: config.skipCache
              ? false
              : joinPaths(
                  config.directories.cache || "node_modules/.cache",
                  "storm",
                  "untyped"
                )
          }
        });

        const promises = [] as Promise<any>[];

        promises.push(generateDeclarationFile(schema, file, config));
        promises.push(generateMarkdownFile(schema, file, config));
        promises.push(generateJsonSchemaFile(schema, file, config));

        return Promise.all(promises);
      })
    );
  };
