import { defineUntypedSchema } from "untyped";
import typescriptLibraryGeneratorSchema from "../../base/typescript-library-generator.schema";

export default defineUntypedSchema({
  ...typescriptLibraryGeneratorSchema,
  $schema: {
    id: "BrowserLibraryGeneratorSchema",
    title: "Browser Library Generator",
    description: "A type definition for a browser library generator schema",
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
      enum: ["browser", "neutral"]
    },
    $default: "browser"
  }
});
