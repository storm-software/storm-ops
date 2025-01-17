import { defineUntypedSchema } from "untyped";
import cargoBaseExecutorSchema from "../../base/cargo-base-executor.schema";

export default defineUntypedSchema({
  ...cargoBaseExecutorSchema,
  $schema: {
    id: "CargoCheckExecutorSchema",
    title: "Cargo Check Executor",
    description: "A type definition for a Cargo/rust check executor schema"
  }
});
