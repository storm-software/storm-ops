import { defineUntypedSchema } from "untyped";

export default defineUntypedSchema({
  $schema: {
    id: "InitGeneratorSchema",
    title: "Init Generator",
    description: "A type definition for an init generator schema"
  },
  skipFormat: {
    $schema: {
      title: "Skip Format",
      type: "boolean",
      description: "Skip formatting the generated files"
    }
  }
});
