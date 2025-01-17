import { defineUntypedSchema } from "untyped";

export default defineUntypedSchema({
  $schema: {
    id: "CleanPackageExecutorSchema",
    title: "Clean Package Executor",
    description: "A type definition for a clean package executor schema"
  },
  outputPath: {
    $schema: {
      title: "Output Path",
      type: "string",
      description: "The path to the output"
    }
  },
  packageJsonPath: {
    $schema: {
      title: "Package JSON Path",
      type: "string",
      format: "path",
      description: "The path to the package.json"
    }
  },
  ignoredFiles: {
    $schema: {
      title: "Ignored Files",
      type: "string",
      description: "The files to ignore"
    }
  },
  fields: {
    $schema: {
      title: "Fields",
      type: "string",
      description: "The fields to include"
    },
    $resolve: (val: string[] = []) => ([] as string[]).concat(val)
  },
  cleanReadMe: {
    $schema: {
      title: "Clean Read Me",
      type: "boolean",
      description: "Clean the read me"
    }
  },
  cleanComments: {
    $schema: {
      title: "Clean Comments",
      type: "boolean",
      description: "Clean the comments"
    }
  }
});
