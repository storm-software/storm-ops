import { StormConfig } from "@storm-software/config";
import { writeTrace } from "@storm-software/config-tools/logger/console";
import { Path } from "glob";
import { writeFile } from "node:fs/promises";
import { Schema } from "untyped";
import { getOutputFile } from "../utilities";

export function generateJsonSchemaFile(
  schema: Schema,
  file: Path,
  config?: StormConfig
) {
  const jsonSchema = getOutputFile(file, "json");
  writeTrace(`Writing JSON schema file ${jsonSchema}`, config);

  return writeFile(jsonSchema, JSON.stringify(schema, null, 2));
}
