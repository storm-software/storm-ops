import { defineUntypedSchema } from "untyped";

export default defineUntypedSchema({
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
    }
  }
});
