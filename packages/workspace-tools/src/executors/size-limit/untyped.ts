import { defineUntypedSchema } from "untyped";
import baseExecutorSchema from "../../base/base-executor.untyped";

export default defineUntypedSchema({
  ...baseExecutorSchema,
  $schema: {
    id: "SizeLimitExecutorSchema",
    title: "Size Limit Executor",
    description: "A type definition for a Size Limit executor schema",
  },
  entry: {
    $schema: {
      title: "Entry",
      type: "array",
      description: "The path to the entry file",
      items: {
        type: "string",
        format: "path",
      },
    },
  },
});
