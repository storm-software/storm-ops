import { defineUntypedSchema } from "untyped";
import cargoBaseExecutorSchema from "../../base/cargo-base-executor.schema";

export default defineUntypedSchema({
  ...cargoBaseExecutorSchema,
  $schema: {
    id: "CargoFormatExecutorSchema",
    title: "Cargo Format Executor",
    description: "A type definition for a Cargo/rust format executor schema"
  }
});
