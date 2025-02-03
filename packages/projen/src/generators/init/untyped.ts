import baseGeneratorSchema from "@storm-software/workspace-tools/base/base-generator.untyped";
import { defineUntypedSchema } from "untyped";

export default defineUntypedSchema({
  ...baseGeneratorSchema,
  $schema: {
    id: "InitGeneratorSchema",
    title: "Init Generator",
    description: "A type definition for the Projen init generator schema",
  },
  directory: {
    $schema: {
      title: "Directory",
      type: "string",
      description: "The directory to initialize the workspace in",
    },
  },
  skipFormat: {
    $schema: {
      title: "Skip Format",
      type: "boolean",
      description: "Skip formatting the generated files",
    },
  },
});
