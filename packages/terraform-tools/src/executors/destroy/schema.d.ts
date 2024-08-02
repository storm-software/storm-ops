import { TerraformExecutorSchema } from "../../base/base-executor";

export type DestroyExecutorSchema = Required<
  Pick<TerraformExecutorSchema, "autoApproval">
>;
