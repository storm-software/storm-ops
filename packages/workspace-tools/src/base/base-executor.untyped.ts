import { defineUntypedSchema } from "untyped";

export default defineUntypedSchema({
  $schema: {
    id: "baseExecutor",
    title: "Base Executor",
    description: "A base type definition for an executor schema"
  },
  outputPath: {
    $schema: {
      title: "Output Path",
      type: "string",
      format: "path",
      description: "The output path for the build"
    },
    $default: "dist/{projectRoot}"
  }
});
