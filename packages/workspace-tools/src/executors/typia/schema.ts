import { defineUntypedSchema } from "untyped";
import baseExecutorSchema from "../../base/base-executor.schema";

export default defineUntypedSchema({
  ...baseExecutorSchema,
  $schema: {
    id: "TypiaExecutorSchema",
    title: "Typia Executor",
    description: "A type definition for a Typia executor schema"
  },
  outputPath: {
    $schema: {
      title: "Output Path",
      type: "string",
      format: "path",
      description: "The output path for the build"
    },
    $default: "{sourceRoot}/__generated__/typia"
  },
  clean: {
    $schema: {
      title: "Clean",
      type: "boolean",
      description: "Clean the output directory before building"
    },
    $default: true
  }
});
