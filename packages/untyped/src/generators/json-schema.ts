import { StormWorkspaceConfig } from "@storm-software/config";
import {
  writeError,
  writeTrace
} from "@storm-software/config-tools/logger/console";
import { Path } from "glob";
import { writeFile } from "node:fs/promises";
import { Schema } from "untyped";
import { getOutputFile } from "../utilities";

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
