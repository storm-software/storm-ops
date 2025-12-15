import { defineUntypedSchema } from "untyped";
import baseGeneratorSchema from "../../base/base-generator.untyped";

export default defineUntypedSchema({
  ...baseGeneratorSchema,
  $schema: {
    id: "ConfigSchemaGeneratorSchema",
    title: "Config Schema Generator",
    description: "A type definition for a config schema generator schema"
  },
  outputFile: {
    $schema: {
      title: "Output File",
      type: "string",
      description: "The file to write the schema to"
    },
    $default: "{workspaceRoot}/storm-workspace.schema.json"
  }
});
