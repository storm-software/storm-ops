import { TerraformExecutorSchema } from "../../base/base-executor";

export type ApplyExecutorSchema = Required<
  Pick<TerraformExecutorSchema, "planFile" | "autoApproval">
>;
