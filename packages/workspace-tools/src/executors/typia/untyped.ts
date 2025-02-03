import { defineUntypedSchema } from "untyped";
import baseExecutorSchema from "../../base/base-executor.untyped";

export default defineUntypedSchema({
  ...baseExecutorSchema,
  $schema: {
    id: "TypiaExecutorSchema",
    title: "Typia Executor",
    description: "A type definition for a Typia executor schema",
    required: ["entry", "tsconfig", "outputPath"],
  },
  entry: {
    $schema: {
      title: "Entry File(s)",
      format: "path",
      type: "array",
      description: "The entry file or files to build",
      items: { type: "string" },
    },
    $default: ["{sourceRoot}/index.ts"],
  },
  tsconfig: {
    $schema: {
      title: "TSConfig Path",
      type: "string",
      format: "path",
      description: "The path to the tsconfig file",
    },
    $default: "{projectRoot}/tsconfig.json",
  },
  outputPath: {
    $schema: {
      title: "Output Path",
      type: "string",
      format: "path",
      description: "The output path for the build",
    },
    $default: "{sourceRoot}/__generated__/typia",
  },
  clean: {
    $schema: {
      title: "Clean",
      type: "boolean",
      description: "Clean the output directory before building",
    },
    $default: true,
  },
});
