import { TerraformExecutorSchema } from "../../base/terraform-executor";

export type DestroyExecutorSchema = Required<
  Pick<TerraformExecutorSchema, "autoApproval">
>;
