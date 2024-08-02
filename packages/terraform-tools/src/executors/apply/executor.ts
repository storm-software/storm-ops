import { withTerraformExecutor } from "../../base/base-executor";
import { ApplyExecutorSchema } from "./schema";

export default withTerraformExecutor<ApplyExecutorSchema>("apply");
