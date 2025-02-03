import { defineUntypedSchema } from "untyped";
import cargoBaseExecutorSchema from "../../base/cargo-base-executor.untyped";

export default defineUntypedSchema({
  ...cargoBaseExecutorSchema,
  $schema: {
    id: "CargoBuildExecutorSchema",
    title: "Cargo Build Executor",
    description: "A type definition for a Cargo/rust build executor schema",
  },
  outputPath: {
    $schema: {
      title: "Output Path",
      type: "string",
      description: "The path to the output directory",
    },
  },
});
