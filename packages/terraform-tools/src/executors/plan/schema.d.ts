import { TerraformExecutorSchema } from "../../base/terraform-executor";

export type PlanExecutorSchema = Required<
  Pick<TerraformExecutorSchema, "planFile">
>;
