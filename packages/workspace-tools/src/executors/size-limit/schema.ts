import { defineUntypedSchema } from "untyped";

export default defineUntypedSchema({
  $schema: {
    id: "SizeLimitExecutorSchema",
    title: "Size Limit Executor",
    description: "A type definition for a Size Limit executor schema"
  },
  entry: {
    $schema: {
      title: "Entry",
      type: "string",
      description: "The path to the entry file"
    }
  }
});
