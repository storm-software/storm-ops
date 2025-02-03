import { defineUntypedSchema } from "untyped";
import cargoBaseExecutorSchema from "../../base/cargo-base-executor.untyped";

export default defineUntypedSchema({
  ...cargoBaseExecutorSchema,
  $schema: {
    id: "CargoDocExecutorSchema",
    title: "Cargo Doc Executor",
    description:
      "A type definition for a Cargo/rust documentation executor schema",
  },
  lib: {
    $schema: {
      title: "Library",
      type: "boolean",
      description: "Generate documentation for the library",
    },
    default: true,
  },
  bins: {
    $schema: {
      title: "Bins",
      type: "boolean",
      description: "Generate documentation for the bins",
    },
    default: true,
  },
  examples: {
    $schema: {
      title: "Examples",
      type: "boolean",
      description: "Generate documentation for the examples",
    },
    default: true,
  },
  noDeps: {
    $schema: {
      title: "No Dependencies",
      type: "boolean",
      description: "Do not generate documentation for dependencies",
    },
    default: false,
  },
});
