import { withTerraformExecutor } from "../../base/terraform-executor";
import { PlanExecutorSchema } from "./schema.d";

export default withTerraformExecutor<PlanExecutorSchema>("plan");
