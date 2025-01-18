import { withTerraformExecutor } from "../../base/terraform-executor";
import { ApplyExecutorSchema } from "./schema.d";

export default withTerraformExecutor<ApplyExecutorSchema>("apply");
