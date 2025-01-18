import { withTerraformExecutor } from "../../base/terraform-executor";
import { OutputExecutorSchema } from "./schema.d";

export default withTerraformExecutor<OutputExecutorSchema>("output");
