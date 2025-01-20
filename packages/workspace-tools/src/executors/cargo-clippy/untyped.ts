import { defineUntypedSchema } from "untyped";
import cargoBaseExecutorSchema from "../../base/cargo-base-executor.untyped";

export default defineUntypedSchema({
  ...cargoBaseExecutorSchema,
  $schema: {
    id: "CargoClippyExecutorSchema",
    title: "Cargo Clippy Executor",
    description: "A type definition for a Cargo/rust clippy executor schema"
  },
  fix: {
    $schema: {
      title: "Fix",
      type: "boolean",
      description: "Automatically fix issues"
    }
  }
});
