import { defineUntypedSchema } from "untyped";
import baseExecutorSchema from "../../base/base-executor.untyped";

export default defineUntypedSchema({
  ...baseExecutorSchema,
  $schema: {
    id: "CleanPackageExecutorSchema",
    title: "Clean Package Executor",
    description:
      "The clean package executor is responsible for removing unnecessary files and fields from a distributable package to make it as light as possible (for scenarios like edge computing, limited memory environments, etc.)",
  },
  outputPath: {
    $schema: {
      title: "Output Path",
      type: "string",
      description: "The path to the output",
    },
    $default: "dist/{projectRoot}",
  },
  packageJsonPath: {
    $schema: {
      title: "Package JSON Path",
      type: "string",
      format: "path",
      description: "The path to the package.json that will be modified",
    },
    $default: "{outputPath}/package.json",
  },
  ignoredFiles: {
    $schema: {
      title: "Ignored Files",
      type: "string",
      description: "The files to ignore",
    },
  },
  fields: {
    $schema: {
      title: "Fields",
      type: "string",
      description: "The fields to include",
    },
    $resolve: (val: string[] = []) => ([] as string[]).concat(val),
  },
  cleanReadMe: {
    $schema: {
      title: "Clean Read Me",
      type: "boolean",
      description: "Clean the read me",
    },
    $default: true,
  },
  cleanComments: {
    $schema: {
      title: "Clean Comments",
      type: "boolean",
      description: "Clean the comments",
    },
    $default: true,
  },
});
