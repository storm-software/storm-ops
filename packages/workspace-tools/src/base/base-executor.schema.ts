import { defineUntypedSchema } from "untyped";

export default defineUntypedSchema({
  $schema: {
    id: "baseExecutor",
    title: "Base Executor",
    description: "A base type definition for an executor schema"
  },
  entry: {
    $schema: {
      title: "Entry File(s)",
      format: "path",
      type: "array",
      description: "The entry file or files to build",
      items: { type: "string" }
    },
    default: ["{sourceRoot}/index.ts"]
  },
  outputPath: {
    $schema: {
      title: "Output Path",
      type: "string",
      format: "path",
      description: "The output path for the build"
    },
    $default: "dist/{projectRoot}"
  },
  tsconfig: {
    $schema: {
      title: "TSConfig Path",
      type: "string",
      format: "path",
      description: "The path to the tsconfig file"
    },
    $default: "{projectRoot}/tsconfig.json"
  }
});
