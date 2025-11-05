import {
  writeError,
  writeTrace
} from "@storm-software/config-tools/logger/console";
import type { StormWorkspaceConfig } from "@storm-software/config/types";
import type { Path } from "glob";
import { writeFile } from "node:fs/promises";
import type { Schema } from "untyped";
import { getOutputFile } from "../utilities";

/**
 * Generate a JSON schema file from a TypeScript schema.
 *
 * @param schema The TypeScript schema to convert.
 * @param file The file to write the JSON schema to.
 * @param config The workspace configuration.
 * @returns A promise that resolves when the file has been written.
 */
export function generateJsonSchemaFile(
  schema: Schema,
  file: Path,
  config?: StormWorkspaceConfig
) {
  try {
    const jsonSchema = getOutputFile(file, "json");
    writeTrace(`Writing JSON schema file ${jsonSchema}`, config);

    return writeFile(jsonSchema, JSON.stringify(schema, null, 2));
  } catch (error) {
    writeError(
      `Error writing JSON schema file for ${file.name}

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
}
