import { withTerraformExecutor } from "../../base/base-executor";
import { PlanExecutorSchema } from "./schema";

export default withTerraformExecutor<PlanExecutorSchema>("plan");
