import { defineUntypedSchema } from "untyped";
import cargoBaseExecutorSchema from "../../base/cargo-base-executor.untyped";

export default defineUntypedSchema({
  ...cargoBaseExecutorSchema,
  $schema: {
    id: "CargoPublishExecutorSchema",
    title: "Cargo Publish Executor",
    description: "A type definition for a Cargo/rust Publish executor schema",
  },
  registry: {
    $schema: {
      title: "Registry",
      type: "string",
      description: "The registry to publish to",
    },
  },
  packageRoot: {
    $schema: {
      title: "Package Root",
      type: "string",
      format: "path",
      description: "The path to the package root",
    },
  },
  dryRun: {
    $schema: {
      title: "Dry Run",
      type: "boolean",
      description: "Perform a dry run",
    },
  },
});
