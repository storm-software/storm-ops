import { defineUntypedSchema } from "untyped";
import typescriptLibraryGeneratorSchema from "../../base/typescript-library-generator.untyped";

export default defineUntypedSchema({
  ...typescriptLibraryGeneratorSchema,
  $schema: {
    id: "NodeLibrarySchema",
    title: "Node Library Generator",
    description: "A type definition for a NodeJs library generator schema",
    required: ["directory", "name"]
  },
  buildExecutor: {
    $schema: {
      title: "Build Executor",
      type: "string",
      description: "The executor to use for building the library"
    },
    $default: "@storm-software/workspace-tools:unbuild"
  },
  platform: {
    $schema: {
      title: "Platform",
      type: "string",
      description: "The platform to target with the library",
      enum: ["node", "neutral"]
    },
    $default: "node"
  }
});
