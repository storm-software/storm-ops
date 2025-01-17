import { defineUntypedSchema } from "untyped";

export default defineUntypedSchema({
  $schema: {
    id: "baseExecutor",
    title: "Base Executor",
    description: "A base type definition for an executor schema"
  },
  entry: {
    $schema: {
      title: "Entry File",
      format: "path",
      description: "The entry file to build"
    },
    $resolve: (val: string[] = ["{sourceRoot}/index.ts"]) =>
      ([] as string[]).concat(val)
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
