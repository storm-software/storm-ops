import { TerraformExecutorSchema } from "../../base/base-executor";

export type PlanExecutorSchema = Required<
  Pick<TerraformExecutorSchema, "planFile">
>;
