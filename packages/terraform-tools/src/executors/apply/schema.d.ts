import { TerraformExecutorSchema } from "../../base/terraform-executor";

export type ApplyExecutorSchema = Required<
  Pick<TerraformExecutorSchema, "planFile" | "autoApproval">
>;
