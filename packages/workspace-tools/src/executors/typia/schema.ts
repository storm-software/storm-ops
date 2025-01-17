import { defineUntypedSchema } from "untyped";

export default defineUntypedSchema({
  $schema: {
    id: "TypiaExecutorSchema",
    title: "Typia Executor",
    description: "A type definition for a Typia executor schema"
  },
  entryPath: {
    $schema: {
      title: "Entry Path",
      type: "string",
      format: "path",
      description: "The path to the entry file"
    }
  },
  outputPath: {
    $schema: {
      title: "Output Path",
      type: "string",
      format: "path",
      description: "The path to the output"
    }
  },
  tsConfig: {
    $schema: {
      title: "TS Config",
      type: "string",
      format: "path",
      description: "The path to the tsconfig.json"
    }
  },
  clean: {
    $schema: {
      title: "Clean",
      type: "boolean",
      description: "Clean the output directory before building"
    }
  }
});
