import { defineUntypedSchema } from "untyped";

export default defineUntypedSchema({
  $schema: {
    id: "BaseGeneratorSchema",
    title: "Base Generator",
    description: "A type definition for the base Generator schema",
    required: ["directory"]
  },
  directory: {
    $schema: {
      title: "Directory",
      type: "string",
      description: "The directory to create the library in"
    }
  }
});
