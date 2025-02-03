import { defineUntypedSchema } from "untyped";
import typescriptBuildExecutorSchema from "../../base/typescript-build-executor.untyped";

export default defineUntypedSchema({
  ...typescriptBuildExecutorSchema,
  $schema: {
    id: "ESBuildExecutorSchema",
    title: "ESBuild Executor",
    description: "A type definition for an ESBuild executor schema",
  },
  format: {
    $schema: {
      title: "Format",
      type: "string",
      description: "The format to build",
      enum: ["cjs", "esm", "iife"],
    },
    $default: "esm",
  },
});
