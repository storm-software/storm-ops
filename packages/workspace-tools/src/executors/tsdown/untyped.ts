import { defineUntypedSchema } from "untyped";
import typescriptBuildExecutorSchema from "../../base/typescript-build-executor.untyped";

export default defineUntypedSchema({
  ...typescriptBuildExecutorSchema,
  $schema: {
    id: "TSDownExecutorSchema",
    title: "TSDown Executor",
    description: "A type definition for a tsdown executor schema"
  }
});
