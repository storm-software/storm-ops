import { defineUntypedSchema } from "untyped";
import baseGeneratorSchema from "./base-generator.untyped";

export default defineUntypedSchema({
  ...baseGeneratorSchema,
  $schema: {
    id: "TypeScriptLibraryGeneratorSchema",
    title: "TypeScript Library Generator",
    description:
      "A type definition for the base TypeScript Library Generator schema",
    required: ["directory", "name"],
  },
  name: {
    $schema: {
      title: "Name",
      type: "string",
      description: "The name of the library",
    },
  },
  description: {
    $schema: {
      title: "Description",
      type: "string",
      description: "The description of the library",
    },
  },
  buildExecutor: {
    $schema: {
      title: "Build Executor",
      type: "string",
      description: "The executor to use for building the library",
    },
    $default: "@storm-software/workspace-tools:unbuild",
  },
  platform: {
    $schema: {
      title: "Platform",
      type: "string",
      description: "The platform to target with the library",
      enum: ["neutral", "node", "worker", "browser"],
    },
    $default: "neutral",
  },
  importPath: {
    $schema: {
      title: "Import Path",
      type: "string",
      description: "The import path for the library",
    },
  },
  tags: {
    $schema: {
      title: "Tags",
      type: "string",
      description: "The tags for the library",
    },
  },
  unitTestRunner: {
    $schema: {
      title: "Unit Test Runner",
      type: "string",
      enum: ["jest", "vitest", "none"],
      description: "The unit test runner to use",
    },
  },
  testEnvironment: {
    $schema: {
      title: "Test Environment",
      type: "string",
      enum: ["jsdom", "node"],
      description: "The test environment to use",
    },
  },
  pascalCaseFiles: {
    $schema: {
      title: "Pascal Case Files",
      type: "boolean",
      description: "Use PascalCase for file names",
    },
    $default: false,
  },
  strict: {
    $schema: {
      title: "Strict",
      type: "boolean",
      description: "Enable strict mode",
    },
    $default: true,
  },
  publishable: {
    $schema: {
      title: "Publishable",
      type: "boolean",
      description: "Make the library publishable",
    },
    $default: false,
  },
  buildable: {
    $schema: {
      title: "Buildable",
      type: "boolean",
      description: "Make the library buildable",
    },
    $default: true,
  },
});
